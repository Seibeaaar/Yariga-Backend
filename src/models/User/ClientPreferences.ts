import { Schema } from "mongoose";
import {
  PROPERTY_TYPES,
  PROPERTY_PREFERENCE_GRADATIONS,
} from "@/constants/property";
import { AGREEMENT_TYPES } from "@/constants/agreement";
import { generateBooleanFacilitiesSchema } from "@/utils/property";

const ClientFacilityPreferencesSchema = new Schema(
  {
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
    ...generateBooleanFacilitiesSchema(),
  },
  { _id: false },
);

const ClientPreferencesSchema = new Schema(
  {
    topPrice: Number,
    bottomPrice: Number,
    topRating: Number,
    bottomRating: Number,
    topArea: Number,
    bottomArea: Number,
    facilities: {
      type: ClientFacilityPreferencesSchema,
      default: undefined,
    },
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
