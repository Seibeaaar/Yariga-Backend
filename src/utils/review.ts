export const calculateRatingOnReviewCreate = (
  rating: number,
  rate: number,
  votes: number,
) => {
  return Math.round((rating * votes + rate) / (votes + 1));
};

export const calculateRatingOnReviewDelete = (
  rating: number,
  rate: number,
  votes: number,
) => {
  return Math.round((rating * votes - rate) / (votes - 1));
};

export const calculateRatingOnReviewUpdate = (
  rating: number,
  votes: number,
  oldRate: number,
  newRate: number,
) => {
  if (oldRate === newRate) return rating;
  return Math.round((rating * votes - oldRate + newRate) / votes);
};
