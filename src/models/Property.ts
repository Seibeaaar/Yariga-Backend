import { Schema, model } from "mongoose";
import { PROPERTY_TYPES, PROPERTY_STATUS } from "@/constants/property";
import { AGREEMENT_TYPES } from "@/constants/sales";
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
});

export default model("Property", PropertySchema);
