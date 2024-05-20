import { io } from ".";
import jwt, { JwtPayload } from "jsonwebtoken";

export const CONNECTED_USERS: {
  [key: string]: string;
} = {};

io.use((socket, next) => {
  const { authorization } = socket.handshake.headers;
  if (!authorization) {
    next(new Error("Authorization required"));
  }

  const token = authorization?.split(" ")[1];

  if (!token) {
    next(new Error("Invalid authorization"));
  }

  jwt.verify(token!, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err || !decoded) {
      next(new Error("Invalid authorization"));
    }
    const { data } = decoded as JwtPayload;
    socket.handshake.headers.user = data;
    next();
  });
});

io.on("connection", (socket) => {
  const user = socket.handshake.headers.user as string;
  CONNECTED_USERS[user] = socket.id;
  socket.on("disconnect", () => {
    const user = socket.handshake.headers.user as string;
    if (CONNECTED_USERS[user]) {
      delete CONNECTED_USERS[user];
    }
  });
});
