import { Router } from "express";
import Property from "@/models/Property";
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
  processPageQueryParam,
} from "@/utils/property";
import Agreement from "@/models/Agreement";
import { PROPERTY_ITEMS_LIMIT } from "@/constants/property";

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
      await property.save();

      await User.findByIdAndUpdate(
        profile.id,
        {
          $push: {
            properties: property.id,
          },
        },
        { new: true },
      );

      res.status(201).send(property);
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

PropertyRouter.get(
  "/mine",
  verifyJWToken,
  checkIfLandlord,
  async (req, res) => {
    try {
      const { profile } = res.locals;

      const properties = await Property.find({
        owner: profile.id,
      });

      res.status(200).send(properties);
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
      const { page } = req.query;
      const filters = req.body as PropertyFilters;
      const pageNumber = processPageQueryParam(page as string | undefined);
      const startIndex = (pageNumber - 1) * PROPERTY_ITEMS_LIMIT;

      const results = await Property.find(generatePropertyFilterQuery(filters))
        .skip(startIndex)
        .limit(PROPERTY_ITEMS_LIMIT);
      const total = results.length;

      res.status(200).send({
        properties: results,
        total,
        page: pageNumber,
        pages: Math.ceil(total / PROPERTY_ITEMS_LIMIT),
      });
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

PropertyRouter.get("/", verifyJWToken, async (req, res) => {
  try {
    const { page } = req.query;

    const pageNumber = processPageQueryParam(page as string | undefined);
    const startIndex = (pageNumber - 1) * PROPERTY_ITEMS_LIMIT;
    const total = await Property.countDocuments();

    const properties = await Property.find()
      .skip(startIndex)
      .limit(PROPERTY_ITEMS_LIMIT);

    res.status(200).send({
      properties,
      total,
      page: pageNumber,
      pages: Math.ceil(total / PROPERTY_ITEMS_LIMIT),
    });
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
});

PropertyRouter.post("/search", verifyJWToken, async (req, res) => {
  try {
    const { q = "", page } = req.query;

    const pageNumber = processPageQueryParam(page as string | undefined);
    const startIndex = (pageNumber - 1) * PROPERTY_ITEMS_LIMIT;
    const regex = new RegExp(q as string, "i");
    const results = await Property.find({
      $or: [
        { location: { $regex: regex } },
        { description: { $regex: regex } },
        { title: { $regex: regex } },
      ],
    })
      .skip(startIndex)
      .limit(PROPERTY_ITEMS_LIMIT)
      .exec();

    const total = results.length;

    res.status(200).send({
      properties: results,
      page: pageNumber,
      total,
      pages: Math.ceil(total / PROPERTY_ITEMS_LIMIT),
    });
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
});

export default PropertyRouter;
