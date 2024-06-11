import { Router } from "express";
import { extractProfileFromToken, verifyJWToken } from "@/middlewares/token";
import { checkMessageInRequest, validateMessage } from "@/middlewares/messages";
import { handleMessageDelete, handleMessageUpdate } from "./handlers";
import { notifyMessageDeleted, notifyMessageUpdated } from "./notifiers";

const MessageRouter = Router();

MessageRouter.put(
  "/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkMessageInRequest,
  validateMessage,
  handleMessageUpdate,
  notifyMessageUpdated,
);

MessageRouter.delete(
  "/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkMessageInRequest,
  handleMessageDelete,
  notifyMessageDeleted,
);

export default MessageRouter;
