import Chat from "@/models/Chat";
import { generateErrorMesaage } from "@/utils/common";
import { Request, Response, NextFunction } from "express";

export const validateChatInRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const chatId = req.params.id;
    if (!chatId) {
      res.statusCode = 400;
      throw new Error("Chat required");
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.statusCode = 404;
      throw new Error(`Chat with id ${chatId} not found`);
    }

    res.locals.chat = chat;
    next();
  } catch (e) {
    res.send(generateErrorMesaage(e));
  }
};
