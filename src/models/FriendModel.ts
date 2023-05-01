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

async function getFriendByName(friendName: string): Promise<Friends | null> {
  const friend = await friendRepository
    .createQueryBuilder('friens')
    .leftJoinAndSelect('friend.user', 'user')
    .where('friend.friendName = :friendName', { friendName })
    .getOne();
  return friend;
}

async function addFriend(userId: string, friendName: string, creator: User): Promise<Friends> {
  let newFriend = new Friends();
  newFriend.friendId = userId;
  newFriend.friendName = friendName;
  newFriend.user = creator;

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

export {
  getFriendsByUserId,
  addFriend,
  friendBelongsToUser,
  deleteFriendById,
  getFriendByName,
  getFriendById,
};
