import {
  PROPERTY_AGREEMENT_TYPE,
  PROPERTY_STATUS,
  PROPERTY_TYPE,
} from "@/enums/property";

export type Property = {
  type: PROPERTY_TYPE;
  area: number;
  status: PROPERTY_STATUS;
  agreementType: PROPERTY_AGREEMENT_TYPE;
  description: string;
  owner: string;
  photos: string[];
  name: string;
};
