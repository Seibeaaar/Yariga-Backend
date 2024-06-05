import { Router } from "express";
import Chat from "@/models/Chat";

import { verifyJWToken, extractProfileFromToken } from "@/middlewares/token";
import { generateErrorMesaage } from "@/utils/common";
import { checkCanCreateChat, validateChatCreation } from "@/middlewares/chats";

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
      }).populate("messages");
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
  validateChatCreation,
  checkCanCreateChat,
  async (req, res) => {
    try {
      const chat = new Chat(req.body);
      await chat.save();

      res.status(200).send(chat);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

export default ChatRouter;
