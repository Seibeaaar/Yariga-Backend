import { Router } from "express";
import PhoneVerification from "@/models/PhoneVerification";
import User from "@/models/User";
import { sendSMS, generateVerificationCode } from "@/utils/phoneNumber";
import {
  checkIfVerificationRequestValid,
  validateNumberForVerification,
  validateVerificationRequest,
} from "@/middlewares/phoneNumber";
import { verifyJWToken, extractProfileFromToken } from "@/middlewares/token";
import { generateErrorMesaage } from "@/utils/common";

const PhoneVerifcationRouter = Router();

PhoneVerifcationRouter.post(
  "/sendRequest",
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

PhoneVerifcationRouter.post(
  "/verifyPhoneNumber",
  verifyJWToken,
  extractProfileFromToken,
  validateNumberForVerification,
  validateVerificationRequest,
  checkIfVerificationRequestValid,
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

export default PhoneVerifcationRouter;
