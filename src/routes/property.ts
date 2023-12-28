import { Router } from "express";
import Property from "@/models/Property";
import User from "@/models/User";
import { verifyJWToken, extractProfileFromToken } from "@/middlewares/token";
import {
  validatePropertyCreation,
  validatePropertyOwnerRole,
} from "@/middlewares/property";
import { PROPERTY_OWNER_TYPE, PROPERTY_STATUS } from "@/enums/property";
import { USER_ROLE } from "@/enums/user";
import { generateErrorMesaage } from "@/utils/common";

const PropertyRouter = Router();

PropertyRouter.post(
  "/add",
  verifyJWToken,
  extractProfileFromToken,
  validatePropertyOwnerRole,
  validatePropertyCreation,
  async (req, res) => {
    try {
      const { profile } = res.locals;
      const propertyOwner = {
        id: profile.id,
        type: PROPERTY_OWNER_TYPE[
          profile.role === USER_ROLE.Sole ? "Sole" : "Agency"
        ],
      };
      const property = new Property({
        ...req.body,
        owner: propertyOwner,
        status: PROPERTY_STATUS.Free,
      });
      const updatedProfile = await User.findByIdAndUpdate(
        profile.id,
        {
          properties: [...profile.properties, property.id],
        },
        { new: true },
      );
      await property.save();
      res.status(201).send({
        profile: updatedProfile,
        property,
      });
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

export default PropertyRouter;
