import { AGREEMENT_TYPES, SALES_STATUSES } from "@/constants/sales";
import { Sales } from "@/types/sales";
import { Schema, model } from "mongoose";

const SalesSchema = new Schema<Sales>({
  // Sales proposals will be created only by a buyer
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
  endDate: {
    type: String,
  },
  status: {
    type: String,
    enum: {
      values: SALES_STATUSES,
    },
  },
});

export default model("Sales", SalesSchema);
