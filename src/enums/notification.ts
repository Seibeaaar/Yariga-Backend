export enum NOTIFICATION_TYPE {
  Booking = "booking",
  Payment = "payment",
  Message = "message",
  Review = "review",
}

/**
 * Events:
 * 1. New sales - a buyer sends an offer
 * 2. Updated sales - a buyer updates his offer
 * 3. Suggested sales - a seller suggests his updates to the offer
 * 4. Accepted sales - a seller accepts the offer
 * 5. Declined offer - a seller declines the offer
 */

export enum NOTIFICATION_EVENT {
  NewSales = "new-sales",
  UpdatedSales = "updated-sales",
  SuggestedSales = "suggested-sales",
  AcceptedSales = "accepted-sales",
  DeclinedSales = "declined-sales",
}
