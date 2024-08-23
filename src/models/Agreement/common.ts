import { Schema } from "mongoose";
import { AGREEMENT_STATUS } from "@/enums/agreement";

export const AgreementCommonFields = {
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
  status: {
    type: String,
    enum: {
      values: Object.values(AGREEMENT_STATUS),
    },
  },
};
