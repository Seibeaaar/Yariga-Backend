import { Socket } from "socket.io";
import Connection from "@/models/Connection";
import { generateErrorMesaage } from "./common";
import { io } from "..";

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

export const emitEvent = async (
  data: object,
  receiver: string,
  event: string,
) => {
  try {
    const counterpartConnection = await Connection.findOne({
      user: receiver,
    });
    if (counterpartConnection) {
      const socket = counterpartConnection.socket;
      io.to(socket).emit(event, data);
    }
  } catch (e) {
    throw new Error(generateErrorMesaage(e));
  }
};
