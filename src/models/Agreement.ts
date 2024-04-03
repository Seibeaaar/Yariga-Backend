import { AGREEMENT_TYPES, AGREEMENT_STATUSES } from "@/constants/agreement";
import { Schema, model } from "mongoose";

const AgreementSchema = new Schema({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 100,
    max: 10000000,
  },
  type: {
    type: String,
    enum: {
      values: AGREEMENT_TYPES,
    },
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: String,
  status: {
    type: String,
    enum: {
      values: AGREEMENT_STATUSES,
    },
  },
});

export default model("Agreement", AgreementSchema);
