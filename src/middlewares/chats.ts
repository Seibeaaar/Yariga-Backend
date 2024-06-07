import { USER_ROLE } from "@/enums/user";
import Chat from "@/models/Chat";
import { checkActiveAgreementBySides } from "@/utils/agreement";
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

export const checkCanCreateChat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { profile } = res.locals;

    if (profile.role === USER_ROLE.Landlord) {
      const { receiver } = req.body;
      const hasActiveAgreement = await checkActiveAgreementBySides(
        profile.id,
        receiver,
      );
      if (!hasActiveAgreement) {
        throw new Error("You are not allowed to create a chat");
      }
    }
    next();
  } catch (e) {
    res.status(403).send(generateErrorMesaage(e));
  }
};
