import { RENT_MAX_PERIOD_YEARS } from "@/constants/agreement";
import User from "@/models/User";
import dayjs from "dayjs";

export const validateAgreementEndDate = (
  startDate: string,
  endDate: string,
) => {
  let error = "";

  switch (true) {
    case !dayjs(endDate).isValid():
      error = "Invalid end date";
      break;
    case dayjs(endDate) < dayjs(startDate):
      error = "End date can't be before the start date";
      break;
    case dayjs(endDate).diff(dayjs(startDate), "years") > RENT_MAX_PERIOD_YEARS:
      error = `Agreement cannot exceed ${RENT_MAX_PERIOD_YEARS} year limit`;
      break;
    default:
      return;
  }

  throw new Error(error);
};

export const validateSidesOfAgreement = async (
  buyer: string,
  seller: string,
) => {
  const buyerProfile = await User.findById(buyer);
  const sellerProfile = await User.findById(seller);

  if (!buyerProfile || !sellerProfile) {
    throw new Error("Invalid buyer and seller info");
  }
};
