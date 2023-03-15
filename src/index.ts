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
  addFriend,
  removeFriend,
} from './controllers/UserController';

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

app.use(express.json());

app.get('/api/users', getAllUsers); // Get user data
app.post('/api/users', registerUser); // Create an Account
app.post('/api/login', logIn); // log in to an Account
app.post('/api/users/:userId/email', updateUserEmail); // update email
app.post('/api/users/:userId/userName', updateUserName); // update userName
app.post('/api/users/:userId/friends/add', addFriend); // add friend + 1
app.post('/api/users/:userId/friends/remove', removeFriend); // remove friend - 1

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
  console.log(`My database is called: ${process.env.DATABASE_NAME}`);
});
