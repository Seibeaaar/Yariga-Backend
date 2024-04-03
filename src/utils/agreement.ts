import Agreement from "@/models/Agreement";

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
