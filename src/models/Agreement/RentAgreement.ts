import dayjs from "dayjs";
import { Schema, model } from "mongoose";
import { AgreementCommonFields } from "./common";
import { PAYMENT_PERIOD } from "@/enums/agreement";
import { RENT_AGREEMENT_MAX, RENT_AGREEMENT_MIN } from "@/constants/agreement";

const RentAgreementSchema = new Schema({
  ...AgreementCommonFields,
  startDate: {
    type: String,
    required: true,
    validate: [
      {
        validator: (sd: string) => {
          return dayjs(sd).isValid();
        },
        message: "Start date is invalid!",
      },
      {
        validator: (sd: string) => {
          return dayjs() < dayjs(sd);
        },
        message: "Start date should be in the future",
      },
    ],
  },
  endDate: {
    type: String,
    required: true,
  },
  payment: {
    period: {
      type: String,
      required: true,
      enum: {
        values: Object.values(PAYMENT_PERIOD),
      },
    },
    amount: {
      type: Number,
      required: true,
      min: RENT_AGREEMENT_MIN,
      max: RENT_AGREEMENT_MAX,
    },
  },
});

export default model("RentAgreement", RentAgreementSchema);
