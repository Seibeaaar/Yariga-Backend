import Property from "@/models/Property";

export const checkIfPropertyExists = async (id?: string) => {
  if (!id) {
    throw new Error("No property id provided");
  }

  const existingProperty = await Property.findById(id);

  if (!existingProperty) {
    throw new Error(`No property with id ${id} found`);
  }

  return existingProperty;
};
