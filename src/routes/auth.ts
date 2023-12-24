import { Router } from "express";
import { omit } from "lodash";

import CommonProfile from "@/models/CommonProfile";
import { signJWToken } from "@/utils/auth";
import { validatePasswordSignUp } from "@/middlewares/auth";
import { COMMON_SERVER_ERROR } from "@/constants/server";

const AuthRouter = Router();

AuthRouter.post("/signUp", validatePasswordSignUp, async (req, res) => {
  try {
    const profile = new CommonProfile(req.body);
    await profile.save();
    const token = signJWToken(profile.id);
    res.status(201).send({
      token,
      profile: omit(profile.toObject(), "password"),
    });
  } catch (e) {
    res.status(500).send(COMMON_SERVER_ERROR);
  }
});

export default AuthRouter;
