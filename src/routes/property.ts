import { Router } from "express";
import Property from "@/models/Property";
import { omit } from "lodash";
import User from "@/models/User";
import { verifyJWToken, extractProfileFromToken } from "@/middlewares/token";
import {
  validatePropertyData,
  validatePropertyIdParam,
  checkiIfPropertyOwner,
} from "@/middlewares/property";
import { checkIfLandlord } from "@/middlewares/profile";
import { PROPERTY_STATUS } from "@/enums/property";
import { generateErrorMesaage } from "@/utils/common";
import { photoUpload } from "@/utils/media";
import { S3File } from "@/types/media";

const PropertyRouter = Router();

PropertyRouter.post(
  "/add",
  verifyJWToken,
  extractProfileFromToken,
  checkIfLandlord,
  photoUpload.array("photos"),
  validatePropertyData,
  async (req, res) => {
    try {
      const { profile } = res.locals;
      if (!req.files) {
        throw new Error("Property pictures cannot be processed");
      }
      const propertyPhotos = req.files as unknown as S3File[];
      const property = new Property({
        ...req.body,
        owner: profile.id,
        status: PROPERTY_STATUS.Free,
        photos: propertyPhotos.map((photo) => photo.location),
      });
      const updatedProfile = await User.findByIdAndUpdate(
        profile.id,
        {
          $push: {
            properties: property.id,
          },
        },
        { new: true },
      );
      await property.save();
      res.status(201).send({
        profile: omit(updatedProfile?.toObject(), "password"),
        property,
      });
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

PropertyRouter.put(
  "/update/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkIfLandlord,
  checkiIfPropertyOwner,
  photoUpload.array("photos"),
  validatePropertyData,
  async (req, res) => {
    try {
      if (!req.files) {
        throw new Error("Property pictures cannot be processed");
      }
      const updatedProperty = await Property.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
        },
        {
          new: true,
        },
      );
      res.status(200).send(updatedProperty);
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

PropertyRouter.delete(
  "/delete/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkIfLandlord,
  validatePropertyIdParam,
  checkiIfPropertyOwner,
  async (req, res) => {
    try {
      const { profile } = res.locals;
      const propertyId = req.params.id;
      await Property.findByIdAndDelete(propertyId);
      await User.findByIdAndUpdate(profile.id, {
        $pull: {
          properties: propertyId,
        },
      });
      res.status(200).send("Property deleted successfully");
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

export default PropertyRouter;
