import * as yup from "yup";
import dayjs from "dayjs";
import { USER_ROLE } from "@/enums/user";

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
