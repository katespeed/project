// This is used to send messages from the server
// to a specific client or broadcast to multiple clients
interface ServerToClientEvents {
  enteredChat: (msg: string) => void;
  // enteredPrivateChat: (msg: string) => void;
  exitedChat: (msg: string) => void;
  chatMessage: (name: string, msg: string) => void;
  // privateChatMessage: (name: string, msg: string) => void;
  receiveCoins: (from: string, amount: number, newBalance: number) => void;
  joinRoom: (name: string) => void;
}

// This is used for the messages from a client
// to the server
interface ClientToServerEvents {
  chatMessage: (msg: string) => void;
  // privateChatMessage: (msg: string) => void;
  sendCoins: (to: string, amount: number) => void;
  joinPrivateRoom: (name: string) => void;
}
