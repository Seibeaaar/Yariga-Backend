import * as yup from "yup";
import dayjs from "dayjs";

import User from "@/models/User";
import { TAX_NUMBER_REGEX } from "@/constants/users";
import { USER_ROLE } from "@/enums/user";
import { ProfileCompletionRequest } from "@/types/profile";

export const POST_AUTH_VALIDATION_SCHEMA = yup.object({
  dateOfBirth: yup
    .string()
    .required("Date of birth required")
    .test("dateOfBirth", "You must be 18 or order", (value) => {
      const customDate = dayjs(value);
      const currentDate = dayjs();
      return customDate.isValid() && currentDate.diff(customDate, "y") >= 18;
    }),
  role: yup.string().required("Role required").oneOf(Object.values(USER_ROLE)),
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
  if (role === USER_ROLE.Tenant) {
    return;
  }

  await validateTaxNumber(taxNumber);
};
