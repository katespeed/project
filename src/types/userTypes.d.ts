type NewUserRequest = {
  userName: string;
  email: string;
  password: string;
};

type UserIdParam = {
  userId: string;
};

type UserNameParam = {
  userName: string;
};

type NewEmailBody = {
  newEmail: string;
};

type NewNameBody = {
  newName: string;
};

type AuthRequest = {
  email: string;
  password: string;
};
