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
