import { Router } from "express";
import PhoneVerification from "@/models/PhoneVerification";
import User from "@/models/User";
import { sendSMS, generateVerificationCode } from "@/utils/verification";
import {
  checkIfEmailVerificationRequestValid,
  checkIfNumberVerificationRequestValid,
  validateNumberForVerification,
  validateNumberVerificationRequest,
} from "@/middlewares/verification";
import { verifyJWToken, extractProfileFromToken } from "@/middlewares/token";
import { generateErrorMesaage } from "@/utils/common";
import EmailVerification from "@/models/EmailVerification";

const VerificationRouter = Router();

VerificationRouter.post(
  "/phone/request",
  verifyJWToken,
  validateNumberForVerification,
  async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      const verificationCode = generateVerificationCode();
      await sendSMS(
        phoneNumber,
        `Your verification code is: ${verificationCode}`,
      );
      const verificationBody = new PhoneVerification({
        phoneNumber,
        verificationCode,
      });
      await verificationBody.save();
      res.status(200).send(verificationCode);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

VerificationRouter.post(
  "/phone/code",
  verifyJWToken,
  extractProfileFromToken,
  validateNumberForVerification,
  validateNumberVerificationRequest,
  checkIfNumberVerificationRequestValid,
  async (req, res) => {
    try {
      const { verificationRequest, profile } = res.locals;
      await PhoneVerification.findByIdAndDelete(verificationRequest.id);
      await User.findByIdAndUpdate(
        profile.id,
        {
          phoneNumber: verificationRequest.phoneNumber,
        },
        {
          new: true,
        },
      );
      res.status(200).send(`${verificationRequest.phoneNumber} verified`);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

VerificationRouter.post(
  "/email/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkIfEmailVerificationRequestValid,
  async (req, res) => {
    try {
      const { profile } = res.locals;
      await EmailVerification.findByIdAndDelete(req.params.id);
      const updatedProfile = await User.findByIdAndUpdate(
        profile.id,
        {
          email: {
            value: profile.email.value,
            verified: true,
          },
        },
        {
          new: true,
        },
      );
      res.status(200).send(updatedProfile);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

export default VerificationRouter;
