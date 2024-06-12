import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

import expressApp from "./express";
import { connectToDatabase } from "./utils/database";
import { connectToSocket } from "./utils/socket";

const server = createServer(expressApp);
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    next(new Error("Authorization token required"));
  }

  jwt.verify(
    token as string,
    process.env.JWT_SECRET as string,
    (err, decoded) => {
      if (err) {
        next(new Error("Invalid token"));
      } else {
        const { data } = decoded as JwtPayload;
        socket.handshake.headers.userId = data;
        next();
      }
    },
  );
});

connectToDatabase();
io.on("connection", connectToSocket);
server.listen(5001);
