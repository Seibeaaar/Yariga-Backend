import { Router } from "express";
import { omit } from "lodash";

import User from "@/models/User";
import { signJWToken } from "@/utils/auth";
import {
  validatePasswordSignUp,
  validateLogin,
  validateUserCredentials,
  checkEmailInUse,
  verifyGoogleAuth,
} from "@/middlewares/auth";
import EmailVerification from "@/models/EmailVerification";
import { generateErrorMesaage } from "@/utils/common";
import { sendVerificationEmail } from "@/utils/verification";

const AuthRouter = Router();

AuthRouter.post(
  "/signUp",
  validatePasswordSignUp,
  checkEmailInUse,
  async (req, res) => {
    try {
      const profile = new User({
        ...req.body,
        email: {
          value: req.body.email,
          verified: false,
        },
      });
      await profile.save();
      const emailVerificationRequest = new EmailVerification({
        email: req.body.email,
      });
      await emailVerificationRequest.save();
      await sendVerificationEmail(
        req.body.email,
        `${req.body.firstName} ${req.body.lastName}`,
        emailVerificationRequest.id,
      );
      const token = signJWToken(profile.id);
      res.status(201).send({
        token,
        profile: omit(profile.toObject(), "password"),
      });
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

AuthRouter.post(
  "/login",
  validateLogin,
  validateUserCredentials,
  async (req, res) => {
    try {
      const { profile } = res.locals;
      const token = signJWToken(profile.id);
      res.status(200).send({
        token,
        profile: omit(profile.toObject(), "password"),
      });
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

AuthRouter.post("/google", verifyGoogleAuth, async (req, res) => {
  try {
    const { payload } = res.locals;

    const existingUser = await User.findOne({
      "email.value": payload?.email,
    });

    if (!existingUser) {
      const newUser = new User({
        firstName: payload?.given_name,
        lastName: payload?.family_name,
        email: {
          value: payload?.email,
          verified: true,
        },
      });

      await newUser.save();

      const token = signJWToken(newUser.id);
      res.status(201).send({
        token,
        profile: newUser,
        isNew: true,
      });
    } else {
      const token = signJWToken(existingUser.id);
      res.status(200).send({
        token,
        profile: existingUser,
        isNew: false,
      });
    }
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
});

export default AuthRouter;
