import * as yup from "yup";
import {
  PROPERTY_TYPES,
  ELEVATED_PROPERTY_TYPES,
  HOSTING_PROPERTY_TYPES,
  PROPERTY_FACILITIES,
  PROPERTY_STATUSES,
} from "@/constants/property";
import {
  FLOOR_LIMIT,
  AREA_LIMIT,
  PRICE_LIMIT,
  ROOM_LIMIT,
  BED_LIMIT,
} from "@/enums/property";
import { AGREEMENT_TYPES } from "@/constants/agreement";
import {
  AGREEMENT_TYPE,
  PAYMENT_PERIOD,
  RENT_PERIOD_TIMEFRAME,
} from "@/enums/agreement";

export const PROPERTY_VALIDATION_SCHEMA = yup.object({
  title: yup.string().required("Property title required"),
  description: yup
    .string()
    .required("Property description required")
    .min(100, "Description must be longer than 100 characters"),
  area: yup
    .number()
    .required("Area of a property required")
    .min(AREA_LIMIT.Min, "Area cannot be less than 1 sq.m.")
    .max(AREA_LIMIT.Max, "Area cannot be larger than 10000 sq.m."),
  price: yup
    .number()
    .required("Price required")
    .min(PRICE_LIMIT.Min, "Price cannot be lower than 1$")
    .max(PRICE_LIMIT.Max, "Price cannot be higher than 50M $"),
  priceNegotiable: yup.boolean(),
  type: yup
    .string()
    .required("Property type required")
    .oneOf(PROPERTY_TYPES, "Invalid property type"),
  rooms: yup
    .number()
    .required("Number of rooms required")
    .min(ROOM_LIMIT.Min, "At least one room")
    .max(ROOM_LIMIT.Max, "Max rooms - 1000"),
  beds: yup.number().when("type", ([type], schema) => {
    return HOSTING_PROPERTY_TYPES.includes(type)
      ? schema
          .required()
          .min(BED_LIMIT.Min, "At least one bed")
          .max(BED_LIMIT.Max, "Top number of beds - 2000")
      : schema;
  }),
  floors: yup
    .number()
    .required("Number of floors required")
    .min(FLOOR_LIMIT.Min, "At least one floor")
    .max(FLOOR_LIMIT.Max, "Should not exceed 100 floors"),
  location: yup
    .object({
      name: yup.string().required("Location name required"),
      lat: yup
        .number()
        .required("Latitude required")
        .min(-180, "Latitude cannot be lower than -180")
        .max(180, "Latitude cannot be higher than 180"),
      lon: yup
        .number()
        .required("Longitude required")
        .min(-90, "Longitude cannot be lower than -90")
        .max(90, "Longitude cannot be higher than 90"),
    })
    .required("Location data required"),
  floorLevel: yup.number().when("type", ([type], schema) => {
    return ELEVATED_PROPERTY_TYPES.includes(type)
      ? schema.required().min(1, "Should be at least on the first floor")
      : schema;
  }),
  facilities: yup.array().ensure().of(yup.string().oneOf(PROPERTY_FACILITIES)),
  paymentPeriod: yup
    .string()
    .required("Payment period required")
    .oneOf(Object.values(PAYMENT_PERIOD), "Invalid payment period"),
  minimumRentPeriod: yup.object().when("agreementType", ([type], schema) => {
    return type === AGREEMENT_TYPE.Rent
      ? schema.shape({
          period: yup
            .string()
            .required()
            .oneOf(Object.values(RENT_PERIOD_TIMEFRAME)),
          value: yup.number().required(),
        })
      : schema;
  }),
});

export const validateDescription = (v: string) => v.trim().length >= 100;

export const PROPERTY_FILTERS_VALIDATION = yup.object({
  topPrice: yup
    .number()
    .min(PRICE_LIMIT.Min, "Top price too low")
    .max(PRICE_LIMIT.Max, "Top price exceeded"),
  bottomPrice: yup.number().when("topPrice", ([topPrice], schema) => {
    return topPrice
      ? schema.min(1, "Bottom price too low").max(topPrice, "Should not exceed")
      : schema;
  }),
  topArea: yup
    .number()
    .min(AREA_LIMIT.Min, "Top area too low")
    .max(AREA_LIMIT.Max, "Top area exceeded"),
  bottomArea: yup.number().when("topArea", ([topArea], schema) => {
    return topArea
      ? schema
          .min(1, "Bottom area too low")
          .max(topArea, "Should not exceed top area")
      : schema;
  }),
  topFloorLevel: yup
    .number()
    .min(FLOOR_LIMIT.Min, "Top floor level at least 1")
    .max(FLOOR_LIMIT.Max, "Top floor level should not exceed"),
  bottomFloorLevel: yup
    .number()
    .when("topFloorLevel", ([topFloorLevel], schema) => {
      return topFloorLevel
        ? schema
            .min(FLOOR_LIMIT.Min, "Bottom floor level at least 1")
            .max(topFloorLevel, "Should not exceed top floor level")
        : schema;
    }),
  topRoomsNumber: yup
    .number()
    .min(ROOM_LIMIT.Min, "Top floor level at least 1")
    .max(ROOM_LIMIT.Max, "Top floor level should not exceed"),
  bottomRoomsNumber: yup
    .number()
    .when("topFloorLevel", ([topRoomsNumber], schema) => {
      return topRoomsNumber
        ? schema
            .min(ROOM_LIMIT.Min, "Bottom floor level at least 1")
            .max(topRoomsNumber, "Should not exceed top floor level")
        : schema;
    }),
  topBedsNumber: yup
    .number()
    .min(BED_LIMIT.Min, "Top floor level at least 1")
    .max(BED_LIMIT.Max, "Top floor level should not exceed"),
  bottomBedsNumber: yup
    .number()
    .when("topBedsNumber", ([topBedsNumber], schema) => {
      return topBedsNumber
        ? schema
            .min(BED_LIMIT.Min, "Bottom floor level at least 1")
            .max(topBedsNumber, "Should not exceed top floor level")
        : schema;
    }),
  topFloorsNumber: yup
    .number()
    .min(FLOOR_LIMIT.Min, "Top floor level at least 1")
    .max(FLOOR_LIMIT.Max, "Top floor level should not exceed"),
  bottomFloorsNumber: yup
    .number()
    .when("topFloorsNumber", ([topFloorsNumber], schema) => {
      return topFloorsNumber
        ? schema
            .min(FLOOR_LIMIT.Min, "Bottom floor level at least 1")
            .max(topFloorsNumber, "Should not exceed top floor level")
        : schema;
    }),

  facilities: yup.array().ensure().of(yup.string().oneOf(PROPERTY_FACILITIES)),
  agreementType: yup.array().ensure().of(yup.string().oneOf(AGREEMENT_TYPES)),
  status: yup.array().ensure().of(yup.string().oneOf(PROPERTY_STATUSES)),
});
