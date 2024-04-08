import * as yup from "yup";
import {
  PROPERTY_TYPES,
  ELEVATED_PROPERTY_TYPES,
  HOSTING_PROPERTY_TYPES,
  PROPERTY_FACILITIES,
} from "@/constants/property";

export const PROPERTY_VALIDATION_SCHEMA = yup.object({
  title: yup.string().required("Property title required"),
  description: yup
    .string()
    .required("Property description required")
    .min(100, "Description must be longer than 100 characters"),
  area: yup
    .number()
    .required("Area of a property required")
    .min(1, "Area cannot be less than 1 sq.m.")
    .max(10000, "Area cannot be larger than 10000 sq.m."),
  price: yup
    .number()
    .required("Price required")
    .min(1, "Price cannot be lower than 1$")
    .max(50000000, "Price cannot be higher than 50M $"),
  priceNegotiable: yup.boolean(),
  type: yup
    .string()
    .required("Property type required")
    .oneOf(PROPERTY_TYPES, "Invalid property type"),
  rooms: yup
    .number()
    .required("Number of rooms required")
    .min(1, "At least one room"),
  beds: yup.number().when("type", ([type], schema) => {
    return HOSTING_PROPERTY_TYPES.includes(type)
      ? schema.required().min(1, "At least one bed")
      : schema;
  }),
  floors: yup
    .number()
    .required("Number of floors required")
    .min(1, "At least one floor"),
  location: yup.string().required("Location required"),
  floorLevel: yup.number().when("type", ([type], schema) => {
    return ELEVATED_PROPERTY_TYPES.includes(type)
      ? schema.required().min(1, "Should be at least on the first floor")
      : schema;
  }),
  facilities: yup.array().ensure().of(yup.string().oneOf(PROPERTY_FACILITIES)),
});

export const validateDescription = (v: string) => v.trim().length >= 100;
