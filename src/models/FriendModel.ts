import { AppDataSource } from '../dataSource';
import { Friends } from '../entities/Friends';
import { User } from '../entities/User';

const friendRepository = AppDataSource.getRepository(Friends);

async function getFriendById(friendId: string): Promise<Friends> {
  return friendRepository
    .createQueryBuilder('friends')
    .where({ where: { friendId } })
    .leftJoin('friends.user', 'user')
    .select(['friends.friendId', 'friends.friendName', 'friends.user'])
    .getOne();
}

async function getFriendsByUserId(userId: string): Promise<Friends[]> {
  const friendList = await friendRepository
    .createQueryBuilder('friends')
    .leftJoinAndSelect('friends.user', 'user')
    .where({ user: { userId } })
    .select(['user', 'friends.friendId', 'friends.friendName'])
    .getMany();
  return friendList;
}

async function addFriend(userId: string, friendName: string, creator: User): Promise<Friends> {
  let num = creator.numOfFriends;
  num += 1;
  let newFriend = new Friends();
  newFriend.friendId = userId;
  newFriend.friendName = friendName;
  newFriend.user = creator;
  newFriend.user.numOfFriends = num;

  newFriend = await friendRepository.save(newFriend);

  return newFriend;
}

async function friendBelongsToUser(friendId: string, userId: string): Promise<boolean> {
  const friendExists = await friendRepository
    .createQueryBuilder('friends')
    .leftJoinAndSelect('friends.user', 'user')
    .where('friends.friendId = :friendId', { friendId })
    .andWhere('user.userId = :userId', { userId })
    .getExists();
  return friendExists;
}

async function deleteFriendById(friendId: string): Promise<void> {
  await friendRepository
    .createQueryBuilder('friends')
    .delete()
    .where('friends.friendId = :friendId', { friendId })
    .execute();
}

// async function decrementFriends(userData: User): Promise<User> {
//   const user = userData;
//   user.numOfFriends -= 1;
//   if (user.numOfFriends < 0) {
//     user.numOfFriends = 0;
//   }
//   await friendRepository
//     .createQueryBuilder()
//     .leftJoinAndSelect('user.friend', 'friend')
//     .update(User)
//     .set({ numOfFriends: user.numOfFriends })
//     .where({ userId: user.userId })
//     // .limit(0)
//     .execute();
//   return user;
// }

export { getFriendById, getFriendsByUserId, addFriend, friendBelongsToUser, deleteFriendById };
