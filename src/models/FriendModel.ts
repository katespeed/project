import { AppDataSource } from '../dataSource';
import { Friends } from '../entities/Friends';
import { User } from '../entities/User';

const friendRepository = AppDataSource.getRepository(Friends);

async function getFriendsByUserId(userId: string): Promise<Friends[]> {
  const links = await friendRepository
    .createQueryBuilder('friends')
    .where({ user: { userId } }) // NOTES: This is how you do nested WHERE clauses
    .leftJoinAndSelect(
      'friends.user',
      'user'
    ) /* TODO: specify the relation you want to join with */
    .select([
      'user',
      'friends.friendId',
      'friends.friendName',
    ]) /* TODO: specify the fields you want */
    .getMany();
  return links;
}

// async function addFriend(friendId: string, friendName: string, creater: User): Promise<Friends> {
//   let num = creater.numOfFriends;
//   num += 1;
//   let newFriend = new Friends();
//   newFriend.friendId = friendId;
//   newFriend.friendName = friendName;
//   newFriend.user = creater;
//   newFriend.user.numOfFriends = num;
//   newFriend = await friendRepository.save(newFriend);
//   return newFriend;
// }

async function addFriend(userId: string, friendName: string, creater: User): Promise<Friends> {
  let num = creater.numOfFriends;
  num += 1;
  let newFriend = new Friends();
  newFriend.friendId = userId;
  newFriend.friendName = friendName;
  newFriend.user = creater;
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

export { getFriendsByUserId, addFriend, friendBelongsToUser, deleteFriendById };
