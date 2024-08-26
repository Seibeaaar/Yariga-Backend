import { EMAIL_REGEX } from "@/constants/verification";

export const validateEmail = (v: string) => EMAIL_REGEX.test(v);
