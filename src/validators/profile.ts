import * as yup from "yup";
import dayjs from "dayjs";

import User from "@/models/User";
import { TAX_NUMBER_REGEX } from "@/constants/users";
import { USER_ROLES } from "@/constants/users";
import { USER_ROLE } from "@/enums/user";
import { ProfileCompletionRequest } from "@/types/profile";
import { PROPERTY_PREFERENCE_GRADATION } from "@/enums/property";
import {
  PROPERTY_PREFERENCE_GRADATIONS,
  PROPERTY_FACILITIES,
} from "@/constants/property";

export const POST_AUTH_VALIDATION_SCHEMA = yup.object({
  dateOfBirth: yup
    .string()
    .required("Date of birth required")
    .test("dateOfBirth", "You must be 18 or order", (value) => {
      const customDate = dayjs(value);
      const currentDate = dayjs();
      return customDate.isValid() && currentDate.diff(customDate, "y") >= 18;
    }),
  role: yup.string().required("Role required").oneOf(USER_ROLES),
});

const validateTaxNumber = async (taxNumber?: string) => {
  if (!taxNumber) {
    throw new Error("Tax number is required");
  }

  if (!TAX_NUMBER_REGEX.test(taxNumber)) {
    throw new Error("Invalid tax number format");
  }

  const userWithTaxNumber = await User.findOne({ taxNumber });

  if (userWithTaxNumber) {
    throw new Error("Tax number is already in use");
  }
};

export const validateSellerInformation = async (
  body: ProfileCompletionRequest,
) => {
  const { taxNumber, role } = body;
  if (role === USER_ROLE.Client) {
    return;
  }

  await validateTaxNumber(taxNumber);
};

export const CLIENT_PREFERENCES_VALIDATION_SCHEMA = yup.object({
  topPrice: yup
    .number()
    .min(1, "Top price at least 1$")
    .max(50000000, "Top price 50M $ at most"),
  bottomPrice: yup.number().when("topPrice", ([topPrice], schema) => {
    return topPrice
      ? schema
          .min(1, "Bottom price at least 1$")
          .max(topPrice, "Should not exceed")
      : schema;
  }),
  topArea: yup
    .number()
    .min(1, "Top area at least 1 sq.m.")
    .max(10000, "Top area 10K sq.m. at most"),
  bottomArea: yup.number().when("topArea", ([topArea], schema) => {
    return topArea
      ? schema
          .min(1, "Bottom area at least 1 sq.m.")
          .max(topArea, "Should not exceed top area")
      : schema;
  }),
  rooms: yup
    .string()
    .oneOf(PROPERTY_PREFERENCE_GRADATIONS)
    .default(PROPERTY_PREFERENCE_GRADATION.Standard),
  beds: yup
    .string()
    .oneOf(PROPERTY_PREFERENCE_GRADATIONS)
    .default(PROPERTY_PREFERENCE_GRADATION.Standard),
  floors: yup
    .string()
    .oneOf(PROPERTY_PREFERENCE_GRADATIONS)
    .default(PROPERTY_PREFERENCE_GRADATION.Standard),
  topFloorLevel: yup.number().min(1, "Top floor level at least 1"),
  bottomFloorLevel: yup
    .number()
    .when("topFloorLevel", ([topFloorLevel], schema) => {
      return topFloorLevel
        ? schema
            .min(1, "Bottom floor level at least 1")
            .max(topFloorLevel, "Should not exceed top floor level")
        : schema;
    }),
  facilities: yup.array().ensure().of(yup.string().oneOf(PROPERTY_FACILITIES)),
});
