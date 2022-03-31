import { io } from './http';

type RoomUser = {
  socket_id: string;
  username: string;
  room: string;
};

type Message = {
  username: string;
  room: string;
  text: string;
  createdAt: Date;
};

const users: RoomUser[] = [];
const messages: Message[] = [];

io.on('connection', (socket) => {
  socket.on('select_room', (data, callback) => {
    socket.join(data.room);

    const userInRoom = users.find(
      (user) => user.username === data.username && user.room === data.room
    );

    if (userInRoom) {
      userInRoom.socket_id = socket.id;
    } else {
      users.push({
        username: data.username,
        room: data.room,
        socket_id: socket.id,
      });
    }

    const messages = getMessagesRoom(data.room);
    callback(messages);
  });

  socket.on('message', (data) => {
    const message: Message = {
      username: data.username,
      room: data.room,
      text: data.message,
      createdAt: new Date(),
    };

    messages.push(message);
    io.to(data.room).emit('message', message);
  });
});

const getMessagesRoom = (room: string) => {
  const messagesRoom = messages.filter((msg) => msg.room === room);
  return messagesRoom;
};
