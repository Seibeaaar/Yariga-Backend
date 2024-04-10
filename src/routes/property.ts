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
import { checkIfLandlord } from "@/middlewares/profile";
import {
  FLOOR_LIMIT,
  AREA_LIMIT,
  PRICE_LIMIT,
  PROPERTY_STATUS,
  BED_LIMIT,
  ROOM_LIMIT,
} from "@/enums/property";
import { generateErrorMesaage } from "@/utils/common";
import { photoUpload } from "@/utils/media";
import { S3File } from "@/types/media";
import { PropertyFilters } from "@/types/property";
import { PROPERTY_STATUSES } from "@/constants/property";
import { AGREEMENT_TYPES } from "@/constants/agreement";

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
      const results = await Property.find({
        price: {
          $gte: filters.bottomPrice ?? PRICE_LIMIT.Min,
          $lte: filters.topPrice ?? PRICE_LIMIT.Max,
        },
        area: {
          $gte: filters.bottomArea ?? AREA_LIMIT.Min,
          $lte: filters.topArea ?? AREA_LIMIT.Max,
        },
        floorLevel: {
          $gte: filters.bottomFloorLevel ?? FLOOR_LIMIT.Min,
          $lte: filters.topFloorLevel ?? FLOOR_LIMIT.Max,
        },
        beds: {
          $gte: filters.bottomBedsNumber ?? BED_LIMIT.Min,
          $lte: filters.topBedsNumber ?? BED_LIMIT.Max,
        },
        rooms: {
          $gte: filters.bottomRoomsNumber ?? ROOM_LIMIT.Min,
          $lte: filters.topRoomsNumber ?? ROOM_LIMIT.Max,
        },
        floors: {
          $gte: filters.bottomFloorsNumber ?? FLOOR_LIMIT.Min,
          $lte: filters.topFloorsNumber ?? FLOOR_LIMIT.Max,
        },
        agreementType: {
          $in: filters.agreementType ?? AGREEMENT_TYPES,
        },
        ...(filters.facilities && {
          facilities: {
            $in: filters.facilities,
          },
        }),
        status: {
          $in: filters.status ?? PROPERTY_STATUSES,
        },
      });
      res.status(200).send(results);
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

export default PropertyRouter;
