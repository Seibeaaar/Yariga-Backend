import { Socket } from "socket.io";
import Connection from "@/models/Connection";

export const connectToSocket = async (socket: Socket) => {
  const userId = socket.handshake.headers.userId as string;

  await Connection.findOneAndDelete({
    user: userId,
  });

  const newConnection = new Connection({
    user: userId,
    socket: socket.id,
  });

  await newConnection.save();

  socket.on("disconnect", async () => {
    await Connection.findOneAndDelete({
      user: userId,
    });
  });
};

export const getCounterpartConnection = async (counterpart: string) => {
  try {
    return await Connection.findOne({
      user: counterpart,
    });
  } catch (e) {
    return null;
  }
};
