import { Request, Response, NextFunction } from "express";
import dayjs from "dayjs";
import PhoneVerification from "@/models/PhoneVerification";
import { generateErrorMesaage } from "@/utils/common";
import {
  validatePhoneNumber,
  validateVerificationCode,
} from "@/validators/phoneNumber";

export const validateNumberForVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      throw new Error("Phone number required");
    }

    if (!validatePhoneNumber(phoneNumber)) {
      throw new Error("Invalid phone number format");
    }

    next();
  } catch (e) {
    res.status(400).send(generateErrorMesaage(e));
  }
};

export const validateVerificationRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { verificationCode } = req.body;
    if (!verificationCode) {
      throw new Error("Verification code missing");
    }

    if (!validateVerificationCode(verificationCode)) {
      throw new Error("Invalid phone number format");
    }

    next();
  } catch (e) {
    res.status(400).send(generateErrorMesaage(e));
  }
};

export const checkIfVerificationRequestValid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { phoneNumber, verificationCode } = req.body;
    const verificationRequest = await PhoneVerification.findOne({
      phoneNumber,
      verificationCode,
    });

    if (!verificationRequest) {
      throw new Error("No verification request found");
    }

    const requestLiveTime = dayjs().diff(
      dayjs(verificationRequest.createdAt),
      "minute",
    );

    if (requestLiveTime > 1) {
      throw new Error("Verification request expired");
    }

    res.locals = {
      ...res.locals,
      verificationRequest,
    };

    next();
  } catch (e) {
    res.status(400).send(generateErrorMesaage(e));
  }
};
