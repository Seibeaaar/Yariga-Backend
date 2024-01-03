import { AGREEMENT_TYPE, SALES_STATUS } from "@/enums/sales";
import { Types } from "mongoose";

export type Sales = {
  buyer: Types.ObjectId;
  seller: Types.ObjectId;
  type: AGREEMENT_TYPE;
  startDate: string;
  endDate?: string;
  amount: number;
  property: Types.ObjectId;
  status: SALES_STATUS;
};
