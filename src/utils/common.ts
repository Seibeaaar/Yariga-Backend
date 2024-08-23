import { COMMON_SERVER_ERROR } from "@/constants/server";

export const generateErrorMesaage = (e: unknown) => {
  if (e instanceof Error) {
    return e.message;
  }
  return COMMON_SERVER_ERROR;
};

export const processPageQueryParam = (page?: string) => {
  if (!page || Number.isNaN(+page)) return 1;
  return +page;
};
