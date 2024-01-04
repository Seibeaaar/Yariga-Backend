import { Router } from "express";
import { omit } from "lodash";

import User from "@/models/User";
import { generateRoleBasedFields, signJWToken } from "@/utils/auth";
import {
  validatePasswordSignUp,
  validateLogin,
  validateUserCredentials,
  checkEmailInUse,
  validateProfileCompletion,
} from "@/middlewares/auth";
import { generateErrorMesaage } from "@/utils/common";
import { extractProfileFromToken, verifyJWToken } from "@/middlewares/token";

const AuthRouter = Router();

AuthRouter.post(
  "/signUp",
  validatePasswordSignUp,
  checkEmailInUse,
  async (req, res) => {
    try {
      const profile = new User(req.body);
      await profile.save();
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

AuthRouter.post(
  "/complete",
  verifyJWToken,
  extractProfileFromToken,
  validateProfileCompletion,
  async (req, res) => {
    try {
      const { profile } = res.locals;
      const roleeBasedFields = generateRoleBasedFields(req.body.role);
      const completedProfile = await User.findByIdAndUpdate(
        profile.id,
        {
          ...req.body,
          ...roleeBasedFields,
        },
        {
          new: true,
        },
      );
      res.status(200).send(completedProfile);
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

export default AuthRouter;
