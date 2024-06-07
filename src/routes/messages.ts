import { Router } from "express";
import Message from "@/models/Message";
import { verifyJWToken } from "@/middlewares/token";
import { generateErrorMesaage } from "@/utils/common";
import { checkMessageInRequest, validateMessage } from "@/middlewares/messages";
import Chat from "@/models/Chat";

const MessageRouter = Router();

MessageRouter.put(
  "/:id",
  verifyJWToken,
  checkMessageInRequest,
  validateMessage,
  async (req, res) => {
    try {
      const { message } = res.locals;
      const updatedMessage = await Message.findByIdAndUpdate(
        message.id,
        req.body,
        {
          new: true,
        },
      );
      res.status(200).send(updatedMessage);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

MessageRouter.delete(
  "/:id",
  verifyJWToken,
  checkMessageInRequest,
  async (req, res) => {
    try {
      const { message } = res.locals;
      await Message.findByIdAndDelete(message.id);
      await Chat.findByIdAndUpdate(message.chat, {
        $pull: {
          messages: message.id,
        },
      });

      res.status(200).send(`Message ${message.id} deleted.`);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

export default MessageRouter;
