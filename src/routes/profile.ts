import { Router } from "express";
import { S3File } from "@/types/media";
import User from "@/models/User";
import { photoUpload } from "@/utils/media";
import { generateErrorMesaage } from "@/utils/common";
import { extractProfileFromToken, verifyJWToken } from "@/middlewares/token";

const ProfileRouter = Router();

ProfileRouter.post(
  "/avatar",
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

export default ProfileRouter;
