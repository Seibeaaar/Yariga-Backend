import { Router } from "express";
import Property from "@/models/Property";
import { omit } from "lodash";
import User from "@/models/User";
import { verifyJWToken, extractProfileFromToken } from "@/middlewares/token";
import {
  validatePropertyData,
  validatePropertyIdParam,
  checkiIfPropertyOwner,
  validatePropertyFilters,
} from "@/middlewares/property";
import { checkIfClient, checkIfLandlord } from "@/middlewares/profile";
import { PROPERTY_STATUS } from "@/enums/property";
import { generateErrorMesaage } from "@/utils/common";
import { photoUpload } from "@/utils/media";
import { S3File } from "@/types/media";
import { PropertyFilters } from "@/types/property";
import {
  generatePropertyFilterQuery,
  getPropertyRecommendations,
} from "@/utils/property";
import Agreement from "@/models/Agreement";

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

PropertyRouter.post(
  "/filter",
  verifyJWToken,
  extractProfileFromToken,
  validatePropertyFilters,
  async (req, res) => {
    try {
      const filters = req.body as PropertyFilters;
      const results = await Property.find(generatePropertyFilterQuery(filters));
      res.status(200).send(results);
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

PropertyRouter.get(
  "/recommendations",
  verifyJWToken,
  extractProfileFromToken,
  checkIfClient,
  async (req, res) => {
    try {
      const {
        profile: { preferences, agreements },
      } = res.locals;
      const agreementDocs = await Agreement.find({
        _id: {
          $in: agreements,
        },
      });
      const previousLandlords = agreementDocs.map((a) => a.seller.toString());
      const results = await getPropertyRecommendations(
        preferences,
        previousLandlords,
      );
      res.status(200).send(results);
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

PropertyRouter.post("/search", verifyJWToken, async (req, res) => {
  try {
    const { q } = req.query;
    // If query is empty - no need to throw an error
    if (!q) {
      res.status(200).send([]);
    }
    const regex = new RegExp(q as string, "i");
    const results = await Property.find({
      $or: [
        { location: { $regex: regex } },
        { description: { $regex: regex } },
        { title: { $regex: regex } },
      ],
    }).exec();

    res.status(200).send(results);
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
});

export default PropertyRouter;
