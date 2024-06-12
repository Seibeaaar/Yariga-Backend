import { AGREEMENT_TYPE } from "@/enums/agreement";
import {
  PROPERTY_FACILITY,
  PROPERTY_STATUS,
  PROPERTY_TYPE,
} from "@/enums/property";

export type PropertyFilters = {
  topPrice?: number;
  bottomPrice?: number;
  topArea?: number;
  bottomArea?: number;
  topFloorLevel?: number;
  bottomFloorLevel?: number;
  facilities?: PROPERTY_FACILITY[];
  agreementType?: AGREEMENT_TYPE[];
  status?: PROPERTY_STATUS[];
  topRoomsNumber?: number;
  bottomRoomsNumber?: number;
  topBedsNumber?: number;
  bottomBedsNumber?: number;
  topFloorsNumber?: number;
  bottomFloorsNumber?: number;
};

export type Property = {
  id: string;
  type: PROPERTY_TYPE;
  facilities: PROPERTY_FACILITY[];
  price: number;
  area: number;
  rooms: number;
  beds?: number;
  floors: number;
  location: string;
  floorLevel?: number;
  title: string;
  description: string;
};
