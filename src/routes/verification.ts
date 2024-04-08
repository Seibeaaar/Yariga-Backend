import { Router } from "express";
import User from "@/models/User";
import { omit } from "lodash";
import { checkIfEmailVerificationRequestValid } from "@/middlewares/verification";
import { verifyJWToken, extractProfileFromToken } from "@/middlewares/token";
import { generateErrorMesaage } from "@/utils/common";
import EmailVerification from "@/models/EmailVerification";

const VerificationRouter = Router();

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
      res.status(200).send(omit(updatedProfile?.toObject(), "password"));
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

export default VerificationRouter;
