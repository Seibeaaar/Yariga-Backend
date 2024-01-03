import * as yup from "yup";
import dayjs from "dayjs";
import User from "@/models/User";
import { USER_ROLES } from "@/constants/users";
import { USER_ROLE } from "@/enums/user";
import { ProfileCompletionRequest } from "@/types/auth";
import {
  PASSWORD_REGEX,
  TAX_NUMBER_REGEX,
  NAME_REGEX,
  LICENSE_NUMBER_REGEX,
} from "@/constants/auth";

export const SIGN_UP_VALIDATION_SCHEMA = yup.object({
  email: yup.string().required("Email required").email("Invalid email"),
  password: yup
    .string()
    .required("Password required")
    .matches(PASSWORD_REGEX, "Invalid password"),
  firstName: yup
    .string()
    .required("First name required")
    .matches(NAME_REGEX, "Invalid first name"),
  lastName: yup
    .string()
    .required("Last name required")
    .matches(NAME_REGEX, "Invalid last name"),
});

export const LOGIN_VALIDATION_SCHEMA = yup.object({
  email: yup.string().required("Email required").email("Invalid email"),
  password: yup.string().required("Password required"),
});

export const POST_AUTH_VALIDATION_SCHEMA = yup.object({
  avatar: yup.string().url(),
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

const validateLicenseNumber = async (licenseNumber?: string) => {
  if (!licenseNumber) {
    throw new Error("License number is required");
  }

  if (!LICENSE_NUMBER_REGEX.test(licenseNumber)) {
    throw new Error("Invalid license number format");
  }

  const userWithLicenseNumber = await User.findOne({ licenseNumber });

  if (userWithLicenseNumber) {
    throw new Error("License number is already in use");
  }
};

export const validateSellerInformation = async (
  body: ProfileCompletionRequest,
) => {
  const { taxNumber, licenseNumber, role } = body;
  if (role === USER_ROLE.Customer) {
    return;
  }

  await validateTaxNumber(taxNumber);
  if (role === USER_ROLE.Agent) {
    await validateLicenseNumber(licenseNumber);
  }
};
