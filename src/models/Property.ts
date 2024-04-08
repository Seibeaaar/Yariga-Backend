import { Schema, model } from "mongoose";
import {
  PROPERTY_TYPES,
  PROPERTY_STATUS,
  PROPERTY_FACILITIES,
} from "@/constants/property";
import { AGREEMENT_TYPES } from "@/constants/agreement";
import { validateDescription } from "@/validators/property";

const PropertySchema = new Schema({
  title: {
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
  photos: [String],
  priceNegotiable: {
    type: Boolean,
    default: false,
  },
  rooms: {
    type: Number,
    required: true,
    default: 1,
  },
  beds: Number,
  floors: {
    type: Number,
    required: true,
    default: 1,
  },
  location: {
    type: String,
    required: true,
  },
  floorLevel: Number,
  facilities: [
    {
      type: String,
      enum: {
        values: PROPERTY_FACILITIES,
      },
    },
  ],
});

export default model("Property", PropertySchema);
