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
  const user = await userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.friend', 'friend')
    .where('user.email = :email', { email })
    .getOne();
  return user;
}

async function getUserByName(userName: string): Promise<User | null> {
  const user = await userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.friend', 'friend')
    .where('user.userName = :userName', { userName })
    .getOne();
  return user;
}

async function getUserById(userId: string): Promise<User | null> {
  const user = await userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.friend', 'friend')
    .where('user.userId = :userId', { userId })
    .getOne();
  return user;
}

async function updateEmailAddress(userId: string, newEmail: string): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .leftJoinAndSelect('user.friend', 'friend')
    .update(User)
    .set({ email: newEmail })
    .where({ userId })
    .execute();
}

async function updateName(userId: string, newName: string): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .leftJoinAndSelect('user.friend', 'friend')
    .update(User)
    .set({ userName: newName })
    .where({ userId })
    .execute();
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
};
