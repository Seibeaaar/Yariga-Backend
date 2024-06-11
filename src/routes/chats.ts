import { Router } from "express";
import Chat from "@/models/Chat";
import Message from "@/models/Message";

import { verifyJWToken, extractProfileFromToken } from "@/middlewares/token";
import { generateErrorMesaage } from "@/utils/common";
import { checkCanCreateChat, validateChatInRequest } from "@/middlewares/chats";
import { validateMessage } from "@/middlewares/messages";

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
  async (req, res, next) => {
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

      res.status(200).send(chatData);
      next();
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

ChatRouter.post(
  "/:id/send",
  verifyJWToken,
  extractProfileFromToken,
  validateChatInRequest,
  validateMessage,
  async (req, res, next) => {
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

      res.status(200).send(message);
      next();
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

ChatRouter.delete(
  "/:id",
  verifyJWToken,
  extractProfileFromToken,
  validateChatInRequest,
  async (req, res, next) => {
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
  },
);

export default ChatRouter;
