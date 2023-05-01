import { Request, Response } from 'express';
import {
  getUserById,
  getUserByEmail,
  getUserByEmailAndName,
  incrementNumOfFriends,
  decrementNumOfFriends,
} from '../models/UserModel';
import {
  addFriend,
  deleteFriendById,
  friendBelongsToUser,
  getFriendByName,
  getFriendsByUserId,
} from '../models/FriendModel';
import { parseDatabaseError } from '../utils/db-utils';

async function getFriendsForUser(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const { userId } = req.params as UserIdParam;
  const user = await getUserById(userId);

  if (!user) {
    res.sendStatus(404);
    return;
  }
  const friends = await getFriendsByUserId(userId);
  // res.json(friends);
  res.render('friendsPage', { friends });
}

async function getFriend(req: Request, res: Response): Promise<void> {
  const { friendName } = req.params as FriendNameParam;
  const users = await getFriendByName(friendName);
  res.json(users);
}

async function registerFriend(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  // Retrieve the user's account data using their ID
  const { authenticatedUser } = req.session;
  const user = await getUserById(authenticatedUser.userId);
  // Check if you got back `null`
  if (!user) {
    res.sendStatus(404);
    return;
  }

  const { email, friendName } = req.body as NewFriendRequest;

  // check if the user with the email exists or not
  if (!(await getUserByEmail(email))) {
    res.sendStatus(404);
    return;
  }

  // username is not unique so getUserByEmailAndName is required
  const friendUser = await getUserByEmailAndName(email, friendName);

  const friendExists = await friendBelongsToUser(friendUser.userId, user.userId);

  // check if the newFriend already exits in the user's friend list
  if (friendExists) {
    res.sendStatus(409);
    return;
  }

  try {
    const newFriend = await addFriend(friendUser.userId, friendName, user);
    console.log(newFriend);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }

  await incrementNumOfFriends(user);

  const friends = await getFriendsByUserId(user.userId);
  res.render('friendsPage', { friends });
}

async function deleteFriendForUser(req: Request, res: Response): Promise<void> {
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    // || !authenticatedUser.isAdmin) {
    res.sendStatus(401); // 401 Unauthorized
    return;
  }
  const { authenticatedUser } = req.session;

  const { email, friendName } = req.body as DeleteFriend;

  // check if the user with the email and the userNama exists or not
  const friendUser = await getUserByEmailAndName(email, friendName);
  if (!friendUser) {
    res.sendStatus(404);
    return;
  }

  const friendExists = await friendBelongsToUser(friendUser.userId, authenticatedUser.userId);

  // check whether friend is in the user's friend list
  if (!friendExists) {
    res.sendStatus(404);
    return;
  }

  try {
    await deleteFriendById(friendUser.userId);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }

  const user = await getUserById(authenticatedUser.userId);
  await decrementNumOfFriends(user);

  const friends = await getFriendsByUserId(authenticatedUser.userId);
  res.render('friendsPage', { friends });
}

export { getFriendsForUser, registerFriend, deleteFriendForUser, getFriend };
