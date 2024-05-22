export const NOTIFICATION_TYPES = [
  "message",
  "agreementCancel",
  "agreementSuccess",
  "agreementUpdate",
  "paymentSuccess",
  "agreementCreate",
];

export const NOTIFICATION_TEMPLATES = {
  message: (fullName: string) => `You've got a message from ${fullName}`,
  agreementCancel: (propertyName: string) =>
    `Agreement regarding ${propertyName} was cancelled`,
  agreementUpdate: (propertyName: string) =>
    `Check out new updated of ${propertyName} agreement`,
  agreementSuccess: (propertyName: string) =>
    `Agreement regarding ${propertyName} was concluded. Congratulations!`,
  paymentSuccess: (fullName: string) =>
    `You've received a payment from ${fullName}`,
};
