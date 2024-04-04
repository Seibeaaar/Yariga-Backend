import { Schema, model } from "mongoose";
import { PROPERTY_TYPES, PROPERTY_STATUS } from "@/constants/property";
import { AGREEMENT_TYPES } from "@/constants/agreement";
import { validateDescription } from "@/validators/property";
import { generateBooleanFacilitiesSchema } from "@/utils/property";

const PropertyFacilitySchema = new Schema(
  {
    numberOfRooms: {
      type: Number,
      default: 1,
    },
    numberOfBeds: {
      type: Number,
      default: 0,
    },
    ...generateBooleanFacilitiesSchema(true),
  },
  { _id: false },
);

const PropertySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: {
      values: PROPERTY_TYPES,
    },
    required: true,
  },
  area: {
    type: Number,
    required: true,
    min: 1,
    max: 10000,
  },
  status: {
    type: String,
    enum: {
      values: PROPERTY_STATUS,
    },
  },
  agreementType: {
    type: String,
    enum: {
      values: AGREEMENT_TYPES,
    },
    required: true,
  },
  description: {
    type: String,
    required: true,
    validate: {
      validator: validateDescription,
      message: "Description must be 100 characters or more",
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  photos: {
    type: [String],
  },
  priceNegotiable: {
    type: Boolean,
    default: false,
  },
  facilities: PropertyFacilitySchema,
});

export default model("Property", PropertySchema);
