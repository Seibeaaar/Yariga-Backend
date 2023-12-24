import * as yup from "yup";

export const LOGIN_SCHEMA = yup.object({
  email: yup.string().required("Email required").email("Invalid email"),
  password: yup.string().required("Password required"),
});
