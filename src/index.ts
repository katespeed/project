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
import { validateLoginBody, validateNewUserBody } from './validators/authValidator';
// import { User } from './entities/User';
// import {
//   getAllLanguages,
//   getAllLanguages,
//   getUserLanguages,
// createLanguage,
// } from './controllers/LanguageController';
// import { getUserFromName } from './models/UserModel';

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

// Friends
app.get('/friends/:userId', getFriendsForUser); // get all friends
app.post('/api/user/friend/add', registerFriend); // register friend
app.post('/api/user/friend/:friendId', deleteFriendForUser); // remove friend - 1
app.get('/api/friends', getFriend); // get friend by Name

// Words
app.post('/api/library/:libraryId/words', makeSentence);
app.get('/api/words/:worId', getWord);
app.get('/words/:languageId', getAllWords);
app.get('/api/languages/:languageId/words', wordExists);
// app.listen(PORT, () => {
//   console.log(`Listening at http://localhost:${PORT}`);
//   console.log(`My database is called: ${process.env.DATABASE_NAME}`);
// });

const server = app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
// socket

const connectedClients: Record<string, CustomWebSocket> = {};
const rooms: Record<string, CustomWebSocket> = {};
// const chatRooms: ChatRoom[] = [];

// console.log(roomName);
const socketServer = new Server<ClientToServerEvents, ServerToClientEvents, null, null>(server);

socketServer.use((socket, next) => {
  sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction);
});

socketServer.on('connection', (socket) => {
  let roomNames = '';
  console.log(roomNames);
  console.log("socketServer.on('connection', (socket)");
  const req = socket.request;
  // const rooms = new Map<string, WebSocket[]>();
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
  let { userName } = authenticatedUser;
  if (!userName) {
    userName = 'unknown user';
  }
  console.log(`${userName} has connected`);
  connectedClients[userName] = socket;

  socketServer.emit('enteredChat', `${userName} has entered the chat`);

  //   socket.on('chatMessage', (msg: string) => {
  //     console.log(`received a chatMessage event from the client: ${userName}`);
  //     socketServer.emit('chatMessage', userName, msg);
  //   });

  //   socket.on('disconnect', () => {
  //     delete connectedClients[userName];
  //     console.log(`${userName} has disconnected`);
  //     socketServer.emit('exitedChat', `${userName} has left the chat.`);
  //   });

  socket.on('joinPrivateRoom', (name): void => {
    // console.log(`${name} is attempting to create room`);
    // if (!(name in connectedClients)) {
    //   console.log(`${name} not connected`);
    //   return;
    // }

    // const receiverSocket = connectedClients[name];
    // const { session: senderSession } = socket.request;
    // const { session: receiverSession } = receiverSocket.request;

    // const { userName } = senderSession.authenticatedUser;
    // const friendName = receiverSession.authenticatedUser.userName;
    // console.log('userId: ', userName);
    // console.log('friendId: ', friendName);
    // const roomName = userName.concat(friendName.toString());
    const roomName = name;
    roomNames = roomName;
    rooms[roomName] = socket;
    console.log('You Joined: ', roomName);
    socket.join(roomName);
  });
  socketServer.to(roomNames).emit('enteredChat', `${userName} has entered the chat`);

  socket.on('chatMessage', (msg: string) => {
    console.log(`received a chatMessage event from the client: ${userName}`);
    socketServer.to(roomNames).emit('chatMessage', userName, msg);
  });

  socket.on('disconnect', () => {
    delete connectedClients[userName];
    console.log(`${userName} has disconnected`);
    socketServer.to(roomNames).emit('exitedChat', `${userName} has left the chat.`);
  });
});
