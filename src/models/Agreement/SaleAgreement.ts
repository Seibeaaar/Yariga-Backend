import dayjs from "dayjs";
import { Schema, model } from "mongoose";
import { AgreementCommonFields } from "./common";
import { SALE_AGREEMENT_MAX, SALE_AGREEMENT_MIN } from "@/constants/agreement";

const SaleAgreementSchema = new Schema({
  ...AgreementCommonFields,
  amount: {
    type: Number,
    required: true,
    min: SALE_AGREEMENT_MIN,
    max: SALE_AGREEMENT_MAX,
  },
  saleDate: {
    type: String,
    required: true,
    validate: [
      {
        validator: (sd: string) => {
          return dayjs(sd).isValid();
        },
        message: "Sale date is invalid!",
      },
      {
        validator: (sd: string) => {
          return dayjs() < dayjs(sd);
        },
        message: "Sale date should be in the future",
      },
    ],
  },
});

export default model("SaleAgreement", SaleAgreementSchema);
