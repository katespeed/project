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

// async function getAllUnverifiedUsers(): Promise<User[]> {
//   return userRepository.find({ where: { verifiedEmail: false } });
// }

async function getUserByEmail(email: string): Promise<User | null> {
  const user = await userRepository.findOne({ where: { email } });
  return user;
}

async function getUserById(userId: string): Promise<User | null> {
  const user = await userRepository.findOne({
    select: {
      // except hash
      userId: true,
      email: true,
      // profileViews: true,
      // verifiedEmail: true,
    },
    where: { userId },
  });
  return user;
}

// async function getViralUsers(): Promise<User[]> {
//   const viralUsers = await userRepository
//     .createQueryBuilder('user')
//     .where('profileViews >= :viralAmount', { viralAmount: 1000 })
//     .select(['user.email', 'user.profileViews'])
//     .getMany();
//   return viralUsers;
// }

// async function getUsersByViews(minViews: number): Promise<User[]> {
//   const viralUsers = await userRepository
//     .createQueryBuilder('user')
//     .where('profileViews >= :minViews and verifiedEmain=true', { minViews }) // Paramater key and name must match
//     .select(['user.email', 'user.profileViews', 'user.joinedOn', 'user.userId'])
//     .getMany();
//   return viralUsers;
// }

// async function resetAllProfileViews(): Promise<void> {
//   await userRepository.createQueryBuilder().update(User).set({ profileViews: 0 }).execute();
// }

// async function resetAllUnverifiedProfileViews(): Promise<void> {
//   await userRepository
//     .createQueryBuilder()
//     .update(User)
//     .set({ profileViews: 0 })
//     .where('unverified <> true')
//     .execute();
// }

// async function incrementProfileViews(userData: User): Promise<User> {
//   const updatedUser = userData;
//   updatedUser.profileViews += 1;
//   await userRepository
//     .createQueryBuilder()
//     .update(User)
//     .set({ profileViews: updatedUser.profileViews })
//     .where({ userId: updatedUser.userId })
//     .execute();
//   return updatedUser;
// }

// async function updateEmailAddress(userId: string, newEmail: string): Promise<void> {
//   // TODO: Implement me!
//   await userRepository
//     .createQueryBuilder()
//     .update(User)
//     .set({ email: newEmail })
//     .where({ userId })
//     .execute();
// }

export {
  addUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  //   getAllUnverifiedUsers,
  //   getViralUsers,
  //   getUsersByViews,
  allUserData,
  //   resetAllProfileViews,
  //   resetAllUnverifiedProfileViews,
  //   incrementProfileViews,
  // updateEmailAddress,
};
