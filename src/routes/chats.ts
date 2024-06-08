import { Router } from "express";
import Chat from "@/models/Chat";
import Message from "@/models/Message";

import { verifyJWToken, extractProfileFromToken } from "@/middlewares/token";
import { generateErrorMesaage } from "@/utils/common";
import { checkCanCreateChat, validateChatInRequest } from "@/middlewares/chats";
import { validateMessage } from "@/middlewares/messages";

import { io } from "../index";
import { getCounterpartConnection } from "@/utils/socket";
import { CHAT_EVENTS } from "@/enums/chats";

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
  async (req, res) => {
    try {
      const { profile } = res.locals;
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

      const counterpartConnection = await getCounterpartConnection(
        [sender, receiver],
        profile.id,
      );

      if (counterpartConnection) {
        io.to(counterpartConnection).emit(CHAT_EVENTS.ChatCreated, chatData);
      }

      res.status(200).send(chatData);
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
  async (req, res) => {
    try {
      const { chat, profile } = res.locals;
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

      const counterpartConnection = await getCounterpartConnection(
        chat.participants,
        profile.id,
      );

      if (counterpartConnection) {
        io.to(counterpartConnection).emit(CHAT_EVENTS.MessageSent, message);
      }

      res.status(200).send(message);
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
  async (req, res) => {
    try {
      const { chat, profile } = res.locals;
      await Message.deleteMany({
        _id: {
          $in: chat.messages,
        },
      });

      await chat.deleteOne();

      const counterpartConnection = await getCounterpartConnection(
        chat.participants,
        profile.id,
      );

      if (counterpartConnection) {
        io.to(counterpartConnection).emit(CHAT_EVENTS.ChatDeleted, chat.id);
      }

      res.status(200).send(`Chat ${chat.id} deleted`);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

export default ChatRouter;
