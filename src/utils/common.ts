import { COMMON_SERVER_ERROR } from "@/constants/server";
import { User } from "@/types/user";

export const generateErrorMesaage = (e: unknown) => {
  if (e instanceof Error) {
    return e.message;
  }
  return COMMON_SERVER_ERROR;
};

export const getFullName = (user: User) => {
  return `${user.firstName} ${user.lastName}`;
};
