import { Request, Response, NextFunction } from "express";
import EmailVerification from "@/models/EmailVerification";
import { generateErrorMesaage } from "@/utils/common";

export const checkIfEmailVerificationRequestValid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const requestId = req.params.id;
    if (!requestId) {
      throw new Error("Email verification id missing");
    }
    const verificationRequest = await EmailVerification.findById(requestId);
    if (!verificationRequest) {
      throw new Error("No email verification request found");
    }
    next();
  } catch (e) {
    res.status(400).send(generateErrorMesaage(e));
  }
};
