import { Schema, model } from "mongoose";
import {
  PROPERTY_TYPES,
  PROPERTY_STATUSES,
  PROPERTY_FACILITIES,
} from "@/constants/property";
import { AGREEMENT_TYPES } from "@/constants/agreement";
import { validateDescription } from "@/validators/property";
import { PAYMENT_PERIOD, RENT_PERIOD_TIMEFRAME } from "@/enums/agreement";

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
      values: PROPERTY_STATUSES,
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
    name: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
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
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  votes: {
    type: Number,
    default: 0,
  },
  paymentPeriod: {
    type: String,
    required: true,
    enum: {
      values: Object.values(PAYMENT_PERIOD),
    },
  },
  minimumRentPeriod: {
    value: {
      type: Number,
      min: 1,
    },
    period: {
      type: String,
      enum: {
        values: Object.values(RENT_PERIOD_TIMEFRAME),
      },
    },
  },
});

export default model("Property", PropertySchema);
