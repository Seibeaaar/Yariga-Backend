import { AGREEMENT_STATUS } from "@/enums/agreement";
import Agreement from "@/models/Agreement";
import User from "@/models/User";
import { Agreement as AgreementType } from "@/types/agreement";
import { Types } from "mongoose";

export const checkIfAgreementExists = async (id?: string) => {
  if (!id) {
    throw new Error("No sale id provided");
  }

  const agreement = await Agreement.findById(id);

  if (!agreement) {
    throw new Error(`No sale with id ${id} found`);
  }

  return agreement;
};

export const getAgreementCounterpart = (
  agreement: AgreementType,
  id: string,
): string => {
  const { buyer, seller } = agreement;
  return [buyer, seller].find((s) => s === id)!;
};

export const checkActiveAgreementBySides = async (
  buyer: string,
  seller: string,
) => {
  const agreement = await Agreement.findOne({
    buyer,
    seller,
  });

  if (!agreement) return false;

  return ![AGREEMENT_STATUS.Completed, AGREEMENT_STATUS.Declined].includes(
    agreement.status as AGREEMENT_STATUS,
  );
};

export const addAgreementsToCounterparts = async (
  buyer: Types.ObjectId | string,
  seller: Types.ObjectId | string,
  agreement: Types.ObjectId | string,
) => {
  await User.findByIdAndUpdate(
    seller,
    {
      $push: {
        agreements: agreement,
      },
    },
    {
      new: true,
    },
  );
  await User.findByIdAndUpdate(
    buyer,
    {
      $push: {
        agreements: agreement,
      },
    },
    {
      new: true,
    },
  );
};

export const removeAgreementsForCounterparts = async (
  buyer: Types.ObjectId | string,
  seller: Types.ObjectId | string,
  agreement: Types.ObjectId | string,
) => {
  await User.findByIdAndUpdate(
    seller,
    {
      $pull: {
        agreements: agreement,
      },
    },
    {
      new: true,
    },
  );
  await User.findByIdAndUpdate(
    buyer,
    {
      $pull: {
        agreements: agreement,
      },
    },
    {
      new: true,
    },
  );
};
