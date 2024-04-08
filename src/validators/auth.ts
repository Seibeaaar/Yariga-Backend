import * as yup from "yup";
import { PASSWORD_REGEX, NAME_REGEX } from "@/constants/auth";

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
