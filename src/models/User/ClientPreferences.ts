import { Schema } from "mongoose";
import {
  PROPERTY_TYPES,
  PROPERTY_PREFERENCE_GRADATIONS,
  PROPERTY_FACILITIES,
} from "@/constants/property";
import { AGREEMENT_TYPES } from "@/constants/agreement";

const ClientPreferencesSchema = new Schema(
  {
    topPrice: Number,
    bottomPrice: Number,
    topRating: Number,
    bottomRating: Number,
    topArea: Number,
    bottomArea: Number,
    numberOfRooms: {
      type: String,
      enum: {
        values: PROPERTY_PREFERENCE_GRADATIONS,
      },
    },
    numberOfBeds: {
      type: String,
      enum: {
        values: PROPERTY_PREFERENCE_GRADATIONS,
      },
    },
    floors: {
      type: String,
      enum: {
        values: PROPERTY_PREFERENCE_GRADATIONS,
      },
    },
    topFloorLevel: Number,
    bottomFloorLevel: Number,
    facilities: [
      {
        type: String,
        enum: {
          values: PROPERTY_FACILITIES,
        },
      },
    ],
    propertyType: {
      type: String,
      enum: {
        values: PROPERTY_TYPES,
      },
    },
    agreementType: {
      type: String,
      enum: {
        values: AGREEMENT_TYPES,
      },
    },
  },
  { _id: false },
);

export default ClientPreferencesSchema;
