import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

async function allUserData(): Promise<User[]> {
  // if (process.env.NODE_ENV === 'dev') {
  const allUsers = await userRepository.find();
  return allUsers;
}

async function addUser(userName: string, email: string, passwordHash: string): Promise<User> {
  let newUser = new User();
  newUser.userName = userName;
  newUser.email = email;
  newUser.passwordHash = passwordHash;
  newUser = await userRepository.save(newUser);
  return newUser;
}

async function getAllUsers(): Promise<User[]> {
  // We use no criteria so this will get all users
  return userRepository.find();
}

async function getUserByEmail(email: string): Promise<User | null> {
  const user = await userRepository.findOne({ where: { email } });
  return user;
}

async function getUserByName(userName: string): Promise<User | null> {
  const user = await userRepository.findOne({ where: { userName } });
  return user;
}

async function getUserById(userId: string): Promise<User | null> {
  const user = await userRepository.findOne({ where: { userId } });
  return user;
}

async function updateEmailAddress(userId: string, newEmail: string): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ email: newEmail })
    .where({ userId })
    .execute();
}

async function updateName(userId: string, newName: string): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ userName: newName })
    .where({ userId })
    .execute();
}

async function incrementFriends(userData: User): Promise<User> {
  const updatedUser = userData;
  updatedUser.numOfFriends += 1;

  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ numOfFriends: updatedUser.numOfFriends })
    .where({ userId: updatedUser.userId })
    .execute();
  return updatedUser;
}

async function decrementFriends(userData: User): Promise<User> {
  const updatedUser = userData;
  updatedUser.numOfFriends -= 1;
  if (updatedUser.numOfFriends < 0) {
    updatedUser.numOfFriends = 0;
  }
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ numOfFriends: updatedUser.numOfFriends })
    .where({ userId: updatedUser.userId })
    // .limit(0)
    .execute();
  return updatedUser;
}

export {
  addUser,
  getUserByEmail,
  getUserById,
  getUserByName,
  getAllUsers,
  allUserData,
  updateEmailAddress,
  updateName,
  incrementFriends,
  decrementFriends,
};
