import * as yup from "yup";
import dayjs from "dayjs";
import { USER_ROLES } from "@/constants/users";
import { USER_ROLE } from "@/enums/user";
import { ProfileCompletionRequest } from "@/types/auth";
/* eslint-disable no-useless-escape */

export const PASSWORD_REGEX =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
export const NAME_REGEX = /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
export const PHONE_NUMBER_REGEX = /^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/;

export const TAX_NUMBER_REGEX =
  /^(01|02|03|04|05|06|10|11|12|13|14|15|16|20|21|22|23|24|25|26|27|30|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|46|47|48|50|51|52|53|54|55|56|57|58|59|60|61|62|63|64|65|66|67|68|71|72|73|74|75|76|77|80|81|82|83|84|85|85|86|86|87|87|88|88|90|91|92|92|93|94|95|98|99|)-\d{7}$/;

export const LICENSE_NUMBER_REGEX = /^\([0-9]{4}\)[0-9]{4}-[0-9]{4}-[0-9]{3}$/;

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

export const validateSellerInformation = (
  body: ProfileCompletionRequest,
): void => {
  const { taxNumber, licenseNumber, role } = body;
  if (role === USER_ROLE.Customer) {
    return;
  }

  let errorMessage = "";

  switch (true) {
    case !taxNumber:
      errorMessage = "Tax number is required";
      break;
    case !TAX_NUMBER_REGEX.test(taxNumber!):
      errorMessage = "Invalid tax number format";
      break;
    case role === USER_ROLE.Agent && !licenseNumber:
      errorMessage = "License number is required";
      break;
    case role === USER_ROLE.Agent && !LICENSE_NUMBER_REGEX.test(licenseNumber!):
      errorMessage = "Invalid license number format";
      break;
    default:
      // If no error cases are true we can just exit the function
      return;
  }

  throw new Error(errorMessage);
};
