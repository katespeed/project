import './config';
import 'express-async-errors';
import express, { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { Server } from 'socket.io';
import {
  registerUser,
  logIn,
  getAllUsers,
  updateUserEmail,
  updateUserName,
  getUserProfileData,
} from './controllers/UserController';

import {
  deleteFriendForUser,
  getFriendsForUser,
  registerFriend,
} from './controllers/FriendController';
// import { validateLoginBody, validateNewUserBody } from './validators/authValidator';
import {
  getAllLanguages,
  // getAllLanguages,
  getUserLanguages,
  // createLanguage,
} from './controllers/LanguageController';

const app: Express = express();
app.set('view engine', 'ejs');
const { PORT, COOKIE_SECRET } = process.env;
const SQLiteStore = connectSqlite3(session);
// socket
// app.use(
//   session({
//     store: new SQLiteStore({ db: 'sessions.sqlite' }),
//     secret: COOKIE_SECRET,
//     cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
//     name: 'session',
//     resave: false,
//     saveUninitialized: false,
//   })
// );
const sessionMiddleware = session({
  store: new SQLiteStore({ db: 'sessions.sqlite' }),
  secret: COOKIE_SECRET,
  cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
  name: 'session',
  resave: false,
  saveUninitialized: false,
});

app.use(sessionMiddleware);
app.use(express.static('public', { extensions: ['html'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// User
app.get('/api/users', getAllUsers); // Get user data
app.post('/api/register', registerUser); // Create an Account
app.post('/api/login', logIn); // log in to an Account
app.post('/api/users/:userId/email', updateUserEmail); // update email
app.post('/api/users/:userId/userName', updateUserName); // update userName

app.get('/users/:userId', getUserProfileData); // get user profile

// Language
app.get('/languages/:userId', getUserLanguages);
// app.post('/api/languages', createLanguage);
app.get('/api/languages', getAllLanguages);

// res.render('homePage', { email: user.email });

// Friends
app.get('/friends/:userId', getFriendsForUser); // get all friends
app.post('/api/user/friend/add', registerFriend); // register friend
app.post('/api/user/friend/:friendId', deleteFriendForUser); // remove friend - 1

// app.listen(PORT, () => {
//   console.log(`Listening at http://localhost:${PORT}`);
//   console.log(`My database is called: ${process.env.DATABASE_NAME}`);
// });

const server = app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

// socket
const connectedClients: Record<string, CustomWebSocket> = {};
const socketServer = new Server<ClientToServerEvents, ServerToClientEvents, null, null>(server);
socketServer.use((socket, next) => {
  sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction);
});

socketServer.on('connection', (socket) => {
  const req = socket.request;

  // We need this chunk of code so that socket.io
  // will automatically reload the session data
  // don't change this code
  socket.use((__, next) => {
    req.session.reload((err) => {
      if (err) {
        socket.disconnect();
      } else {
        next();
      }
    });
  });

  // This is just to make sure only logged in users
  // are able to connect to a game
  if (!req.session.isLoggedIn) {
    console.log('An unauthenticated user attempted to connect.');
    socket.disconnect();
    return;
  }

  const { authenticatedUser } = req.session;
  const { email } = authenticatedUser;

  console.log(`${email} has connected`);
  connectedClients[email] = socket;

  socket.on('disconnect', () => {
    delete connectedClients[email];
    console.log(`${email} has disconnected`);
    socketServer.emit('exitedChat', `${email} has left the chat.`);
  });

  socketServer.emit('enteredChat', `${email} has entered the chat`);

  socket.on('chatMessage', (msg: string) => {
    console.log(`received a chatMessage event from the client: ${email}`);
    socketServer.emit('chatMessage', email, msg);
  });
});
