import { Schema, model } from "mongoose";
import {
  PROPERTY_TYPES,
  PROPERTY_AGREEMENT_TYPES,
  PROPERTY_STATUS,
  PROPERTY_OWNER_TYPES,
} from "@/constants/property";
import { validateDescription } from "@/validators/property";

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
    max: 5000,
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
      values: PROPERTY_AGREEMENT_TYPES,
    },
    required: true,
  },
  description: {
    type: String,
    validate: {
      validator: validateDescription,
      message: "Description must be 100 characters or more",
    },
  },
  owner: {
    type: {
      type: String,
      enum: {
        values: PROPERTY_OWNER_TYPES,
      },
    },
    id: String,
  },
});

export default model("Property", PropertySchema);
