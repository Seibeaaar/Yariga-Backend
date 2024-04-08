import { AGREEMENT_TYPE } from "@/enums/agreement";
import User from "@/models/User";
import dayjs from "dayjs";

export const validateAgreementStartDate = (v: string) => {
  if (!dayjs(v).isValid()) {
    throw new Error("Invalid start date");
  }

  let error = "";
  const dayDifference = dayjs(v).diff(dayjs(), "days");

  switch (true) {
    case dayDifference < 0:
      error = "Start date should be today or in the future";
      break;
    case dayDifference > 15:
      error = "Start date should not be in more than 15 days from today";
      break;
    default:
      return;
  }

  throw new Error(error);
};

export const validateAgreementEndDate = (
  startDate: string,
  type: AGREEMENT_TYPE,
  endDate?: string,
) => {
  if (type === AGREEMENT_TYPE.Sale || !endDate) {
    return;
  }

  let error = "";

  switch (true) {
    case !dayjs(endDate).isValid():
      error = "Invalid end date";
      break;
    case dayjs(endDate) < dayjs(startDate):
      error = "End date can't be before the start date";
      break;
    case dayjs(endDate).diff(dayjs(startDate), "years") > 5:
      error = "Agreement cannot exceed 5 year limit";
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
