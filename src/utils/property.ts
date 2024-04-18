import Property from "@/models/Property";
import { PropertyFilters } from "@/types/property";
import {
  FLOOR_LIMIT,
  AREA_LIMIT,
  PRICE_LIMIT,
  BED_LIMIT,
  ROOM_LIMIT,
} from "@/enums/property";
import { PROPERTY_STATUSES } from "@/constants/property";
import { AGREEMENT_TYPES } from "@/constants/agreement";

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

export const getPropertyRecommendations = async (
  filters: PropertyFilters,
  landlords: string[],
) => {
  const queryByFilters = generatePropertyFilterQuery(filters);
  const results = await Property.aggregate([
    {
      $facet: {
        landlordsProperties: [
          {
            $match: {
              owner: { $in: landlords },
              ...queryByFilters,
            },
          },
          {
            $addFields: { sortBy: 0 },
          },
        ],
        others: [
          {
            $match: {
              owner: { $nin: landlords },
              ...queryByFilters,
            },
          },
          { $sort: { sortBy: -1 } },
        ],
      },
    },
    {
      $project: {
        properties: { $concatArrays: ["$landlordsProperties", "$others"] },
      },
    },
    {
      $unwind: "$properties",
    },
    {
      $replaceRoot: { newRoot: "$properties" },
    },
    {
      $limit: 500,
    },
  ]);

  return results;
};

export const generatePropertyFilterQuery = (filters: PropertyFilters) => {
  return {
    price: {
      $gte: filters.bottomPrice ?? PRICE_LIMIT.Min,
      $lte: filters.topPrice ?? PRICE_LIMIT.Max,
    },
    area: {
      $gte: filters.bottomArea ?? AREA_LIMIT.Min,
      $lte: filters.topArea ?? AREA_LIMIT.Max,
    },
    floorLevel: {
      $gte: filters.bottomFloorLevel ?? FLOOR_LIMIT.Min,
      $lte: filters.topFloorLevel ?? FLOOR_LIMIT.Max,
    },
    beds: {
      $gte: filters.bottomBedsNumber ?? BED_LIMIT.Min,
      $lte: filters.topBedsNumber ?? BED_LIMIT.Max,
    },
    rooms: {
      $gte: filters.bottomRoomsNumber ?? ROOM_LIMIT.Min,
      $lte: filters.topRoomsNumber ?? ROOM_LIMIT.Max,
    },
    floors: {
      $gte: filters.bottomFloorsNumber ?? FLOOR_LIMIT.Min,
      $lte: filters.topFloorsNumber ?? FLOOR_LIMIT.Max,
    },
    agreementType: {
      $in: filters.agreementType ?? AGREEMENT_TYPES,
    },
    ...(filters.facilities && {
      facilities: {
        $in: filters.facilities,
      },
    }),
    status: {
      $in: filters.status ?? PROPERTY_STATUSES,
    },
  };
};
