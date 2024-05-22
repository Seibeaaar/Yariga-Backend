import { generateErrorMesaage } from "@/utils/common";
import { Request, Response, NextFunction } from "express";
import Notification from "@/models/Notification";

export const checkNotificationExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.params.id) {
      res.statusCode = 400;
      throw new Error("No notification id provided");
    }

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      res.statusCode = 404;
      throw new Error(`Notification with ID ${req.params.id} not found.`);
    }

    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.send(message);
  }
};
