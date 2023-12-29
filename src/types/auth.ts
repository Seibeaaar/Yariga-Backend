import { USER_ROLE } from "@/enums/user";

export type ProfileCompletionRequest = {
  role: USER_ROLE;
  avatar?: string;
  taxNumber?: string;
  licenseNumber?: string;
  dateOfBirth: string;
};
