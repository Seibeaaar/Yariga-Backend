import { Router } from "express";
import Message from "@/models/Message";
import { extractProfileFromToken, verifyJWToken } from "@/middlewares/token";
import { generateErrorMesaage } from "@/utils/common";
import { checkMessageInRequest, validateMessage } from "@/middlewares/messages";
import Chat from "@/models/Chat";

import { io } from "../index";
import { getCounterpartConnection } from "@/utils/socket";
import { CHAT_EVENTS } from "@/enums/chats";

const MessageRouter = Router();

MessageRouter.put(
  "/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkMessageInRequest,
  validateMessage,
  async (req, res) => {
    try {
      const { message, profile } = res.locals;
      const updatedMessage = await Message.findByIdAndUpdate(
        message.id,
        req.body,
        {
          new: true,
        },
      );

      const counterpartConnection = await getCounterpartConnection(
        [message.sender, message.receiver],
        profile.id,
      );

      if (counterpartConnection) {
        io.to(counterpartConnection).emit(CHAT_EVENTS.MessageUpdated, message);
      }

      res.status(200).send(updatedMessage);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

MessageRouter.delete(
  "/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkMessageInRequest,
  async (req, res) => {
    try {
      const { message, profile } = res.locals;
      await Message.findByIdAndDelete(message.id);
      await Chat.findByIdAndUpdate(message.chat, {
        $pull: {
          messages: message.id,
        },
      });

      const counterpartConnection = await getCounterpartConnection(
        [message.sender, message.receiver],
        profile.id,
      );

      if (counterpartConnection) {
        io.to(counterpartConnection).emit(
          CHAT_EVENTS.MessageDeleted,
          message.id,
        );
      }

      res.status(200).send(`Message ${message.id} deleted.`);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

export default MessageRouter;
