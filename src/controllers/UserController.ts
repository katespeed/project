import { Request, Response } from 'express';
import argon2 from 'argon2';
import { addMinutes, isBefore, parseISO, formatDistanceToNow } from 'date-fns';
import {
  addUser,
  getUserByEmail,
  getUserById,
  allUserData,
  updateEmailAddress,
  updateName,
  // getUserFromName,
  //   incrementFriends,
  //   decrementFriends,
} from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function getAllUsers(req: Request, res: Response): Promise<void> {
  const users = await allUserData();
  res.json(users);
}

async function getUsers(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const users = await getUserById(userId);
  res.json(users);
}

// async function getUserByName(req: Request, res: Response): Promise<void> {
//   const { friendName } = req.params as FriendNameParam;
//   const users = await getUserFromName(friendName);
//   res.json(users);
// }

async function registerUser(req: Request, res: Response): Promise<void> {
  const { userName, email, password } = req.body as NewUserRequest;
  // Hash the user's password
  const passwordHash = await argon2.hash(password);
  try {
    // Store the hash instead of their actual password
    const newUser = await addUser(userName, email, passwordHash);
    console.log(newUser);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  console.log(req.session);

  const now = new Date();
  // NOTES: We need to convert the date string back into a Date() object
  //        `parseISO()` does the conversion
  const logInTimeout = parseISO(req.session.logInTimeout);
  // NOTES: If the client has a timeout set and it has not expired
  if (logInTimeout && isBefore(now, logInTimeout)) {
    // NOTES: This will create a human friendly duration message
    const timeRemaining = formatDistanceToNow(logInTimeout);
    const message = `You have ${timeRemaining} remaining.`;
    // NOTES: Reject their request
    res.status(429).send(message); // 429 Too Many Requests
    return;
  }

  const { email, password } = req.body as AuthRequest;

  const user = await getUserByEmail(email);
  if (!user) {
    // res.sendStatus(404); // 404 Not Found - email doesn't exist
    res.redirect('/login');
    return;
  }

  const { passwordHash } = user;
  if (!(await argon2.verify(passwordHash, password))) {
    // NOTES: If they haven't attempted to log in yet
    if (!req.session.logInAttempts) {
      req.session.logInAttempts = 1; // NOTES: Set their attempts to one
    } else {
      req.session.logInAttempts += 1; // NOTES: Otherwise increment their attempts
    }

    // NOTES: If the client has failed five times then we will add a
    //        3 minute timeout
    if (req.session.logInAttempts >= 5) {
      const threeMinutesLater = addMinutes(now, 3).toISOString(); // NOTES: Must convert to a string
      req.session.logInTimeout = threeMinutesLater;
      req.session.logInAttempts = 0; // NOTES: Reset their attempts
    }

    res.sendStatus(404); // 404 Not Found - user with email/pass doesn't exist
    res.redirect('/login');
    return;
  }

  // NOTES: Remember to clear the session before setting their authenticated session data
  await req.session.clearSession();

  // NOTES: Now we can add whatever data we want to the session
  req.session.authenticatedUser = {
    userId: user.userId,
    userName: user.userName,
    email: user.email,
  };
  req.session.isLoggedIn = true;

  res.render('homePage', { userName: user.userName, userId: user.userId });
}

async function getUserProfileData(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;

  // Get the user account
  const user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  // res.json(user);
  res.render('profilePage', {
    userId: user.userId,
    userName: user.userName,
    email: user.email,
    numOfFriends: user.numOfFriends,
  });
}

// `/users/${user.userId}`
async function updateUserEmail(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { newEmail } = req.body as NewEmailBody;
  // Get the user account
  const user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404); // 404 Not Found
    return;
  }
  // Update emaial
  try {
    await updateEmailAddress(userId, newEmail);
    user.email = newEmail;
    res.json(user);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function updateUserName(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { newName } = req.body as NewNameBody;
  const user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404); // 404 Not Found
    return;
  }
  try {
    await updateName(userId, newName);
    user.userName = newName;
    res.json(user);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export {
  getUsers,
  registerUser,
  logIn,
  getAllUsers,
  updateUserEmail,
  updateUserName,
  getUserProfileData,
  // getUserByName,
};
