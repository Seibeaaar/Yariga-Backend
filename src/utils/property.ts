import Property from "@/models/Property";
import { PROPERTY_BOOLEAN_FACILITIES } from "@/constants/property";
import { FacilitiesBooleanSchema } from "@/types/property";

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

/**
 * Used to generate a schema with facilities fields that are boolean.
 * Clients in their preferences don't have default values, properties - do have
 * @param defaultRequired
 * @returns FacilitiesBooleanSchema
 */

export const generateBooleanFacilitiesSchema = (defaultRequired?: boolean) => {
  const schema: FacilitiesBooleanSchema = {};
  for (const field of PROPERTY_BOOLEAN_FACILITIES) {
    schema[field] = {
      type: Boolean,
      ...(defaultRequired && { default: false }),
    };
  }
  return schema;
};
