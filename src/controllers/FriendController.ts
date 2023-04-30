import { Request, Response } from 'express';
import { getUserById, getUserByEmail, getUserByEmailAndName } from '../models/UserModel';
import {
  addFriend,
  //   decrementFriends,
  deleteFriendById,
  // friendBelongsToUser,
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

async function registerFriend(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  // Retrieve the user's account data using their ID
  const { authenticatedUser } = req.session;
  const user = await getUserById(authenticatedUser.userId);
  // Check if you got back `null`
  console.log(1);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  const { email, friendName } = req.body as NewFriendRequest;
  console.log(2);

  // check if the user with the email exists or not
  if (!(await getUserByEmail(email))) {
    res.sendStatus(404);
    return;
  }

  console.log(3);
  // username is not unique so getUserByNameEmail is required
  const friendUser = await getUserByEmailAndName(email, friendName);
  console.log(4);
  // check if the newFriend already exits in the user's friend list
  // if (friendBelongsToUser(friendUser.userId, user.userId)) {
  //   res.sendStatus(404);
  //   return;
  // }

  try {
    const newFriend = await addFriend(friendUser.userId, friendName, user);
    console.log(newFriend);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
  res.sendStatus(201);
}

async function deleteFriendForUser(req: Request, res: Response): Promise<void> {
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    // || !authenticatedUser.isAdmin) {
    res.sendStatus(401); // 401 Unauthorized
    return;
  }
  //   const user = await getUserById(authenticatedUser.userId);
  // const { friendId } = req.body as FriendIdBody;

  const { email, friendName } = req.body as DeleteFriend;

  // check if the user with the email and the userNama exists or not
  const friendUser = await getUserByEmailAndName(email, friendName);
  if (!friendUser) {
    res.sendStatus(404);
    return;
  }

  // check whether user friend is in the user's friend list
  // const friendExists = await friendBelongsToUser(friendUser.userId, authenticatedUser.userId);
  // if (!friendExists) {
  //   res.sendStatus(403); // 403 Forbidden
  //   return;
  // }

  try {
    await deleteFriendById(friendUser.userId);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }

  //   await decrementFriends(user);
  res.sendStatus(204); // 204 No Content
}

export { getFriendsForUser, registerFriend, deleteFriendForUser };
