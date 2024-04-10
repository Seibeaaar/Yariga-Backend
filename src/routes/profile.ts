import { Router } from "express";
import { S3File } from "@/types/media";
import { omit } from "lodash";
import User from "@/models/User";
import { photoUpload } from "@/utils/media";
import { generateErrorMesaage } from "@/utils/common";
import { extractProfileFromToken, verifyJWToken } from "@/middlewares/token";
import {
  validateProfileCompletion,
  checkIfClient,
} from "@/middlewares/profile";
import { validatePropertyFilters } from "@/middlewares/property";
import { generateRoleBasedFields } from "@/utils/profile";

const ProfileRouter = Router();

ProfileRouter.post(
  "/picture",
  verifyJWToken,
  extractProfileFromToken,
  photoUpload.single("picture"),
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
          profilePicture: `${file.location}`,
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
      res.status(200).send(omit(completedProfile?.toObject, "password"));
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
  validatePropertyFilters,
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
      res.status(200).send(omit(updatedClientProfile?.toObject(), "password"));
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

export default ProfileRouter;
