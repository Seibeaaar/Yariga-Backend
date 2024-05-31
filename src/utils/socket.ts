import { Socket } from "socket.io";

export const CONNECTED_USERS: {
  [key: string]: string;
} = {};

export const connectToSocket = (socket: Socket) => {
  const userId = socket.handshake.headers.userId as string;
  CONNECTED_USERS[userId] = socket.id;

  socket.on("disconnect", () => {
    if (CONNECTED_USERS[userId]) delete CONNECTED_USERS[userId];
  });
};
