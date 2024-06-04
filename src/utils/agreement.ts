import Agreement from "@/models/Agreement";
import { Agreement as AgreementType } from "@/types/agreement";

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
