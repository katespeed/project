// eslint-disable-next-line no-undef
const socket = io();

const messages = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
// const privateChatForm = document.getElementById('privateChatForm');
const chatMessage = document.getElementById('chatMessage');
// const privateChatMessage = document.getElementById('privateChatMessage');
// const transferForm = document.getElementById('transferForm');
const createRoomForm = document.getElementById('createRoomForm');

// Enter
socket.on('enteredChat', (msg) => {
  const item = document.createElement('li');
  item.classList.add('enterChatMessage');
  item.textContent = `${msg}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

// socket.on('enteredPrivateChat', (msg) => {
//   const item = document.createElement('li');
//   item.classList.add('enterPrivateChatMessage');
//   item.textContent = `${msg}`;
//   messages.appendChild(item);
//   window.scrollTo(0, document.body.scrollHeight);
// });

// Exit
socket.on('exitedChat', (msg) => {
  const item = document.createElement('li');
  item.classList.add('enterChatMessage');
  item.textContent = `${msg}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

// Chat
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (chatMessage.value) {
    socket.emit('chatMessage', chatMessage.value);
    chatMessage.value = '';
  }
});

// privateChatForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   if (privateChatMessage.value) {
//     socket.emit('privateChatMessage', privateChatMessage.value);
//     privateChatMessage.value = '';
//   }
// });

socket.on('chatMessage', (name, msg) => {
  const item = document.createElement('li');
  item.classList.add('chatMessage');
  item.textContent = `${name}: ${msg}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

// socket.on('privateChatMessage', (name, msg) => {
//   const item = document.createElement('li');
//   item.classList.add('privateChatMessage');
//   item.textContent = `${name}: ${msg}`;
//   messages.appendChild(item);
//   window.scrollTo(0, document.body.scrollHeight);
// });

// transferForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   const to = document.getElementById('to').value;
//   const amount = parseInt(document.getElementById('amount').value, 10);
//   socket.emit('sendCoins', to, amount);
// });

// socket.on('receiveCoins', (from, amount, newBalance) => {
//   const item = document.createElement('li');
//   item.classList.add('transferReceiveMessage');
//   item.textContent = `${from} sent you ${amount} coins. You now have ${newBalance} total coins`;
//   messages.appendChild(item);
//   window.scrollTo(0, document.body.scrollHeight);
// });

// Create Room
createRoomForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  socket.emit('joinPrivateRoom', name);
});

socket.on('joinRoom', (name) => {
  const item = document.createElement('li');
  item.classList.add('joinRoom');
  item.textContent = `${name} create room with you`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
