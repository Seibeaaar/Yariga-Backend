import { Request, Response, NextFunction } from "express";
import Message from "@/models/Message";
import Chat from "@/models/Chat";
import { generateErrorMesaage } from "@/utils/common";

export const handleMessageUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { message } = res.locals;
    const updatedMessage = await Message.findByIdAndUpdate(
      message.id,
      req.body,
      {
        new: true,
      },
    );
    res.status(200).send(updatedMessage);

    res.locals.message = updatedMessage;
    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const handleMessageDelete = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { message } = res.locals;
    await Message.findByIdAndDelete(message.id);
    await Chat.findByIdAndUpdate(message.chat, {
      $pull: {
        messages: message.id,
      },
    });
    res.status(200).send(`Message ${message.id} deleted.`);
    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};
