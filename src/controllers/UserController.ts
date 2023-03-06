import { Request, Response } from 'express';
import argon2 from 'argon2';
import {
  addUser,
  getUserByEmail,
  allUserData,
  // getUserById,
  // incrementProfileViews,
  // updateEmailAddress,
} from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function registerUser(req: Request, res: Response): Promise<void> {
  const { userName, email, password } = req.body as NewUserRequest;
  // Hash the user's password
  const passwordHash = await argon2.hash(password);

  try {
    // Store the hash instead of their actual password
    const newUser = await addUser(userName, email, passwordHash);
    console.log(newUser);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as NewUserRequest;
  const user = await getUserByEmail(email);
  if (!user) {
    res.sendStatus(404); // 404 Not Found - email doesn't exist
    return;
  }
  const { passwordHash } = user;
  if (!(await argon2.verify(passwordHash, password))) {
    res.sendStatus(404); // 404 Not Found - user with email/pass doesn't exist
    return;
  }
  res.sendStatus(200); // OK
}

async function getAllUsers(req: Request, res: Response): Promise<void> {
  const users = await allUserData();
  res.json(users);
}

// async function getUserProfileData(req: Request, res: Response): Promise<void> {
//   const { userId } = req.params as UserIdParam;
//   // Get the user account
//   let user = await getUserById(userId);
//   if (!user) {
//     res.sendStatus(404); // 404 Not Found
//     return;
//   }
//   // Now update their profile views
//   user = await incrementProfileViews(user);
//   res.json(user); // Send back the user's data
// }

// async function updateUserEmail(req: Request, res: Response): Promise<void> {
//   // TODO: Implement me!
//   const { email } = req.params as NewEmailBody;
//   const { userId } = req.body as UserIdParam;
//   // Get the user account
//   const user = await getUserById(userId);
//   if (!user) {
//     res.sendStatus(404); // 404 Not Found
//     return;
//   }
//   // Update emaial
//   updateEmailAddress(userId, email);
//   res.json(user);
// }

export { registerUser, logIn, getAllUsers }; // updateUserEmail };
