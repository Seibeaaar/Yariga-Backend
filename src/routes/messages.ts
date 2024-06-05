import { Router } from "express";
import Message from "@/models/Message";
import { extractProfileFromToken, verifyJWToken } from "@/middlewares/token";
import { generateErrorMesaage } from "@/utils/common";
import { validateMessage } from "@/middlewares/messages";
import { photoUpload } from "@/utils/media";

const MessageRouter = Router();

MessageRouter.post(
  "/send",
  verifyJWToken,
  extractProfileFromToken,
  photoUpload.single("media"),
  validateMessage,
  async (req, res) => {
    try {
      const message = new Message({
        ...req.body,
        ...(req.file && { media: req.file }),
      });

      await message.save();
      res.status(200).send(message);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

export default MessageRouter;
