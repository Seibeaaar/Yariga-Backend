import { Agreement as AgreementType } from "@/types/agreement";

export const getAgreementCounterpart = (
  agreement: AgreementType,
  id: string,
): string => {
  const { buyer, seller } = agreement;
  return [buyer, seller].find((s) => s === id)!;
};
