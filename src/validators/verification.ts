import { VERIFICATION_CODE_REGEX, EMAIL_REGEX } from "@/constants/verification";
import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

export const validatePhoneNumber = (value: string) => {
  const phoneNumber = phoneUtil.parseAndKeepRawInput(value);
  return phoneUtil.isValidNumber(phoneNumber);
};

export const validateVerificationCode = (value: string) =>
  VERIFICATION_CODE_REGEX.test(value);

export const validateEmail = (v: string) => EMAIL_REGEX.test(v);
