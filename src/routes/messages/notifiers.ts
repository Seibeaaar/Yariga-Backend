import { Request, Response } from "express";
import { generateErrorMesaage } from "@/utils/common";
import { emitChatEventToCounterpart } from "@/utils/chats";
import { CHAT_EVENTS } from "@/enums/chats";

export const notifyMessageUpdated = async (req: Request, res: Response) => {
  try {
    const { profile, message } = res.locals;

    await emitChatEventToCounterpart(
      CHAT_EVENTS.MessageUpdated,
      profile,
      message.receiver,
      message,
    );
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const notifyMessageDeleted = async (req: Request, res: Response) => {
  try {
    const { profile, message } = res.locals;

    await emitChatEventToCounterpart(
      CHAT_EVENTS.ChatDeleted,
      profile,
      message.receiver,
      message,
    );
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};
