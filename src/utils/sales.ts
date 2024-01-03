import Sale from "@/models/Sale";

export const checkIfSaleExists = async (id?: string) => {
  if (!id) {
    throw new Error("No sale id provided");
  }

  const sale = await Sale.findById(id);

  if (!sale) {
    throw new Error(`No sale with id ${id} found`);
  }

  return sale;
};
