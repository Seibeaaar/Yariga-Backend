import { Router } from "express";
import { omit } from "lodash";
import User from "@/models/User";
import { USER_ROLE } from "@/enums/user";
import { validateProfileCompletion } from "@/middlewares/auth";
import { verifyJWToken, extractProfileFromToken } from "@/middlewares/token";
import { generateErrorMesaage } from "@/utils/common";

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
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

export default SolePropRouter;
