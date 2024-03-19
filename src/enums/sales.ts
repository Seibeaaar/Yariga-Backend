export enum AGREEMENT_TYPE {
  Sale = "sale",
  Rent = "rent",
}

/**
 * Sales status
 * 1. Pending - an offer that is suggested by a buyer
 * 2. Completed - an offer accepted by a seller
 * 3. Declined - a seller has declined an offer
 */

export enum SALES_STATUS {
  Pending = "pending",
  Completed = "completed",
  Declined = "declined",
}
