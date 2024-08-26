import { Router } from "express";
import Chat from "@/models/Chat";

import { verifyJWToken, extractProfileFromToken } from "@/middlewares/token";
import { generateErrorMesaage } from "@/utils/common";
import { checkCanCreateChat, validateChatInRequest } from "@/middlewares/chats";
import { validateMessage } from "@/middlewares/messages";
import {
  handleChatCreate,
  handleChatDelete,
  handleMessageSend,
} from "./handlers";
import {
  notifyChatCreated,
  notifyChatDeleted,
  notifyMessageSent,
} from "./notifiers";

const ChatRouter = Router();

ChatRouter.get(
  "/",
  verifyJWToken,
  extractProfileFromToken,
  async (req, res) => {
    const { profile } = res.locals;
    try {
      const chats = await Chat.find({
        participants: profile.id,
      })
        .populate("messages")
        .populate("participants", "firstName lastName profilePicture");
      res.status(200).send(chats);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

ChatRouter.post(
  "/create",
  verifyJWToken,
  extractProfileFromToken,
  checkCanCreateChat,
  validateMessage,
  handleChatCreate,
  notifyChatCreated,
);

ChatRouter.post(
  "/:id/send",
  verifyJWToken,
  extractProfileFromToken,
  validateChatInRequest,
  validateMessage,
  handleMessageSend,
  notifyMessageSent,
);

ChatRouter.delete(
  "/:id",
  verifyJWToken,
  extractProfileFromToken,
  validateChatInRequest,
  handleChatDelete,
  notifyChatDeleted,
);

export default ChatRouter;
