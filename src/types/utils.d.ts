type DatabaseConstraintError = {
  type: 'unique' | 'check' | 'not null' | 'foreign key' | 'unknown';
  columnName?: string;
  message?: string;
};

type NewUserRequest = {
  userName: string;
  email: string;
  password: string;
};

type UserIdParam = {
  userId: string;
};

type NewEmailBody = {
  email: string;
};
