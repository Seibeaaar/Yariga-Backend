import { Request, Response, NextFunction } from "express";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import { generateErrorMesaage } from "@/utils/common";

export const handleChatCreate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sender, receiver } = req.body;

    const message = new Message(req.body);

    const chat = new Chat({
      participants: [sender, receiver],
      messages: [message.id],
    });
    await chat.save();

    message.chat = chat.id;
    await message.save();

    const chatData = await Chat.findById(chat.id)
      .populate("messages")
      .populate("participants", "firstName lastName profilePicture");

    res.locals.chat = chatData;

    res.status(200).send(chatData);
    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const handleMessageSend = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { chat } = res.locals;
    const message = new Message({
      ...req.body,
      chat: chat.id,
    });
    await message.save();

    await Chat.findByIdAndUpdate(chat.id, {
      $push: {
        messages: message.id,
      },
    });

    res.locals.message = message;

    res.status(200).send(message);
    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const handleChatDelete = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { chat } = res.locals;
    await Message.deleteMany({
      _id: {
        $in: chat.messages,
      },
    });

    await chat.deleteOne();

    res.status(200).send(`Chat ${chat.id} deleted`);
    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};
