import { Request, Response } from "express";
import { generateErrorMesaage } from "@/utils/common";
import { emitChatEventToCounterpart } from "@/utils/chats";
import { CHAT_EVENTS } from "@/enums/chats";

export const notifyChatCreated = async (req: Request, res: Response) => {
  try {
    const { profile, chat } = res.locals;
    const { receiver } = req.body;

    await emitChatEventToCounterpart(
      CHAT_EVENTS.ChatCreated,
      profile,
      receiver,
      chat,
    );
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const notifyChatDeleted = async (req: Request, res: Response) => {
  try {
    const { profile, chat } = res.locals;
    const receiver = chat.participants.find((p: string) => p !== profile.id);

    await emitChatEventToCounterpart(
      CHAT_EVENTS.ChatDeleted,
      profile,
      receiver,
      chat,
    );
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const notifyMessageSent = async (req: Request, res: Response) => {
  try {
    const { profile, message } = res.locals;

    await emitChatEventToCounterpart(
      CHAT_EVENTS.MessageSent,
      profile,
      message.receiver,
      message,
    );
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};
