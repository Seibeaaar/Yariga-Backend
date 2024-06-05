import { USER_ROLE } from "@/enums/user";
import Chat from "@/models/Chat";
import { checkActiveAgreementBySides } from "@/utils/agreement";
import { generateErrorMesaage } from "@/utils/common";
import { Request, Response, NextFunction } from "express";

export const validateChatCreation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Chat.validate(req.body);
    next();
  } catch (e) {
    res.status(400).send(generateErrorMesaage(e));
  }
};

export const checkCanCreateChat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { profile } = res.locals;

    if (profile.role === USER_ROLE.Landlord) {
      const { receiver } = req.body;
      const hasActiveAgreement = await checkActiveAgreementBySides(
        profile.id,
        receiver,
      );
      if (!hasActiveAgreement) {
        throw new Error("You are not allowed to create a chat");
      }
    }
    next();
  } catch (e) {
    res.status(403).send(generateErrorMesaage(e));
  }
};
