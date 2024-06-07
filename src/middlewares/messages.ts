import { generateErrorMesaage } from "@/utils/common";
import { Request, Response, NextFunction } from "express";
import Message from "@/models/Message";

export const validateMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log(req.body);
    await Message.validate(req.body);
    next();
  } catch (e) {
    res.status(400).send(generateErrorMesaage(e));
  }
};

export const checkMessageInRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const messageId = req.params.id;
    if (!messageId) {
      res.statusCode = 400;
      throw new Error("Message required");
    }

    const message = await Message.findById(messageId);
    if (!message) {
      res.statusCode = 404;
      throw new Error(`Message with id ${messageId} not found`);
    }

    res.locals.message = message;
    next();
  } catch (e) {
    res.send(generateErrorMesaage(e));
  }
};
