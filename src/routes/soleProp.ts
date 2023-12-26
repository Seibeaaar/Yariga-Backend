import { Router } from "express";
import { omit } from "lodash";
import User from "@/models/User";
import { USER_ROLE } from "@/enums/user";
import { validateProfileCompletion } from "@/middlewares/auth";
import { verifyJWToken, extractProfileFromToken } from "@/middlewares/token";

import { COMMON_SERVER_ERROR } from "@/constants/server";

const SolePropRouter = Router();

SolePropRouter.post(
  "/create",
  verifyJWToken,
  extractProfileFromToken,
  validateProfileCompletion,
  async (req, res) => {
    try {
      const { profile } = res.locals;
      const updatedProfile = await User.findByIdAndUpdate(
        profile.id,
        {
          ...req.body,
          role: USER_ROLE.Sole,
          sales: [],
          properties: [],
          clients: [],
        },
        {
          new: true,
        },
      );
      res.status(201).send(omit(updatedProfile?.toObject(), "password"));
    } catch (e) {
      res.status(500).send(COMMON_SERVER_ERROR);
    }
  },
);

export default SolePropRouter;
