import { USER_ROLE } from "@/enums/user";

export type User = {
  firstName: string;
  lastName: string;
  email: {
    value: string;
    verified: true;
  };
  role: USER_ROLE;
  dateOfBirth: string;
  avatar?: string;
  id: string;
};
