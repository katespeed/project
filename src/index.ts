import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import {
  registerUser,
  logIn,
  getAllUsers,
  updateUserEmail,
  updateUserName,
  //   addFriend,
  //   removeFriend,
} from './controllers/UserController';

import {
  deleteFriendForUser,
  getFriendsForUser,
  registerFriend,
} from './controllers/FriendController';

const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite' }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
    name: 'session',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public', { extensions: ['html'] }));

// User
app.get('/api/users', getAllUsers); // Get user data
app.post('/api/register', registerUser); // Create an Account
app.post('/api/login', logIn); // log in to an Account
app.post('/api/users/:userId/email', updateUserEmail); // update email
app.post('/api/users/:userId/userName', updateUserName); // update userName

// Friends
app.get('/api/user/:userId/friend', getFriendsForUser); // get all friends
app.post('/api/user/friend/add', registerFriend); // register friend
app.post('/api/user/friend/:friendId', deleteFriendForUser); // remove friend - 1

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
  console.log(`My database is called: ${process.env.DATABASE_NAME}`);
});
