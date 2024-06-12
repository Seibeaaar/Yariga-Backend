import { NOTIFICATION_TYPE } from "@/enums/notification";
import Notification from "@/models/Notification";
import { generateErrorMesaage } from "./common";
import { emitEvent } from "./socket";

export const constructMessageNotification = (receiverFullName: string) =>
  `You've got a message from ${receiverFullName}`;

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

export const sendNotification = async (
  content: string,
  type: NOTIFICATION_TYPE,
  sender: string,
  receiver: string,
) => {
  try {
    const notification = new Notification({
      content,
      sender,
      receiver,
      type,
    });

    await notification.save();

    await emitEvent(notification, receiver, type);
  } catch (e) {
    throw new Error(generateErrorMesaage(e));
  }
};
