import { VERIFICATION_CODE_REGEX } from "@/constants/auth";
import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

export const validatePhoneNumber = (value: string) => {
  const phoneNumber = phoneUtil.parseAndKeepRawInput(value);
  return phoneUtil.isValidNumber(phoneNumber);
};

export const validateVerificationCode = (value: string) =>
  VERIFICATION_CODE_REGEX.test(value);
