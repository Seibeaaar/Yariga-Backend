import { USER_ROLE } from "@/enums/user";

export type ProfileCompletionRequest = {
  role: USER_ROLE;
  avatar?: string;
  taxNumber?: string;
  licenseNumber?: string;
  dateOfBirth: string;
};

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  email: {
    value: string;
    verified: true;
  };
  role: USER_ROLE;
  dateOfBirth: string;
  profilePicture?: string;
};
