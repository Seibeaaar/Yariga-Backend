import { NOTIFICATION_TYPE } from "@/enums/notification";

export const constructAgreementNotification = (
  type: NOTIFICATION_TYPE,
  propertyTitle: string,
) => {
  switch (type) {
    case NOTIFICATION_TYPE.AgreementCancel:
      return `Agreement upon ${propertyTitle} was canceled.`;
    case NOTIFICATION_TYPE.AgreementSuccess:
      return `Agreement upon ${propertyTitle} was accepted. Congrats!`;
    case NOTIFICATION_TYPE.AgreementCreate:
      return `You have a new agreement upon ${propertyTitle}`;
    case NOTIFICATION_TYPE.AgreementUpdate:
      return `Check out updates regarding the agreement upon ${propertyTitle}`;
    case NOTIFICATION_TYPE.PaymentSucces:
      return `Payment for ${propertyTitle} came through.`;
    default:
      return "";
  }
};
