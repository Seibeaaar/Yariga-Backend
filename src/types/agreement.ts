import { AGREEMENT_STATUS, AGREEMENT_TYPE } from "@/enums/agreement";

export type Agreement = {
  id: string;
  buyer: string;
  seller: string;
  property: string;
  status: AGREEMENT_STATUS;
  amount: number;
  type: AGREEMENT_TYPE;
  startDate: string;
  endDate?: string;
};
