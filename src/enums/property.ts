export enum PROPERTY_TYPE {
  Apartment = "apartment",
  House = "house",
  Garage = "garage",
  Hotel = "hotel",
  Commercial = "commercial",
}

export enum PROPERTY_STATUS {
  Sold = "sold",
  Reserved = "reserved",
  Free = "free",
}

export enum PROPERTY_AGREEMENT_TYPE {
  Sale = "sale",
  Rent = "rent",
}

export enum PROPERTY_PREFERENCE_GRADATION {
  Standard = "standard",
  Big = "big",
  Extra = "extra",
}

export enum PROPERTY_GRADATED_VALUE {
  Rooms = "rooms",
  Beds = "beds",
  Floors = "floors",
}

export enum PROPERTY_FACILITY {
  Kitchen = "kitchen",
  Balcony = "balcony",
  Parking = "parking",
  Smoking = "smoking",
  WiFI = "wiFi",
}

export enum PRICE_LIMIT {
  Min = 1,
  Max = 50000000,
}

export enum AREA_LIMIT {
  Min = 1,
  Max = 10000,
}

export enum FLOOR_LIMIT {
  Min = 1,
  Max = 100,
}

export enum ROOM_LIMIT {
  Min = 1,
  Max = 1000,
}

export enum BED_LIMIT {
  Min = 1,
  Max = 2000,
}
