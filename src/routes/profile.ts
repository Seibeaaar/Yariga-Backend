import { Router } from "express";
import { S3File } from "@/types/media";
import User from "@/models/User";
import { photoUpload } from "@/utils/media";
import { generateErrorMesaage } from "@/utils/common";
import { extractProfileFromToken, verifyJWToken } from "@/middlewares/token";
import {
  validateProfileCompletion,
  checkIfClient,
  validateClientPreferences,
} from "@/middlewares/profile";
import { generateRoleBasedFields } from "@/utils/profile";

const ProfileRouter = Router();

ProfileRouter.post(
  "/picture",
  verifyJWToken,
  extractProfileFromToken,
  photoUpload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        throw new Error("There is an error process profile picture");
      }
      const { profile } = res.locals;
      // Hard reset of Multer.File type
      const file = req.file as unknown as S3File;
      const updatedProfile = await User.findByIdAndUpdate(
        profile.id,
        {
          avatar: `${file.location}`,
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

ProfileRouter.post(
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

ProfileRouter.post(
  "/preferences",
  verifyJWToken,
  extractProfileFromToken,
  checkIfClient,
  validateClientPreferences,
  async (req, res) => {
    try {
      const { profile } = res.locals;
      const updatedClientProfile = await User.findByIdAndUpdate(
        profile.id,
        {
          $set: {
            preferences: req.body,
          },
        },
        {
          new: true,
        },
      );
      res.status(200).send(updatedClientProfile);
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

export default ProfileRouter;
