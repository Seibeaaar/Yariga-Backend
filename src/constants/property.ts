export const PROPERTY_TYPES = [
  "house",
  "apartment",
  "hotel",
  "commercial",
  "garage",
];

export const ELEVATED_PROPERTY_TYPES = ["apartment", "hotel", "commercial"];
export const HOSTING_PROPERTY_TYPES = ["house", "apartment", "hotel"];

export const PROPERTY_STATUSES = ["free", "sold", "reserved"];

export const PROPERTY_PREFERENCE_GRADATIONS = ["standard", "big", "extra"];

/**
 * Properties have facilities that can be present or not
 * so they are boolean
 */
export const PROPERTY_FACILITIES = [
  "kitchen",
  "parking",
  "smoking",
  "balcony",
  "wiFi",
];

export const PROPERTY_ITEMS_LIMIT = 2;
export const RECOMMENDATIONS_LIMIT = 50;
