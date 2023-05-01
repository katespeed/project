type NewFriendRequest = {
  email: string;
  friendName: string;
};

type DeleteFriend = {
  email: string;
  friendName: string;
};

type FriendIdBody = {
  friendId: string;
};

type FriendIdParam = {
  friendId: string;
};

type FriendNameParam = {
  friendName: string;
};
