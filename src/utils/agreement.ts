import Agreement from "@/models/Agreement";
import {
  Agreement as AgreementType,
  AgreementNotificationBody,
} from "@/types/agreement";
import Property from "@/models/Property";
import Notification from "@/models/Notification";
import { io } from "..";
import { NOTIFICATION_TEMPLATES } from "@/constants/notification";
import { NOTIFICATION_TYPE } from "@/enums/notification";
import { CONNECTED_USERS } from "@/socket";

export const checkIfAgreementExists = async (id?: string) => {
  if (!id) {
    throw new Error("No sale id provided");
  }

  const agreement = await Agreement.findById(id);

  if (!agreement) {
    throw new Error(`No sale with id ${id} found`);
  }

  return agreement;
};

export const notifyAgreementCounterpart = async (
  user: string,
  type: NOTIFICATION_TYPE,
  agreement: AgreementType,
) => {
  const counterpart = [agreement.buyer, agreement.seller].filter(
    (s) => s !== user,
  )[0];

  const property = await Property.findById(agreement.property);

  if (!property) {
    throw new Error("No property under this agreement found.");
  }

  const notificationBody = {} as AgreementNotificationBody;
  switch (type) {
    case NOTIFICATION_TYPE.AgreementUpdate:
      notificationBody.agreement = agreement;
      notificationBody.message = NOTIFICATION_TEMPLATES.agreementUpdate(
        property.title,
      );
      break;
    case NOTIFICATION_TYPE.AgreementSuccess:
      notificationBody.agreement = agreement.id;
      notificationBody.message = NOTIFICATION_TEMPLATES.agreementSuccess(
        property.title,
      );
      break;
    case NOTIFICATION_TYPE.AgreementCancel:
      notificationBody.agreement = agreement.id;
      notificationBody.message = NOTIFICATION_TEMPLATES.agreementCancel(
        property.title,
      );
      break;
    default:
      throw new Error("Invalid agreement notification type");
  }

  const notification = new Notification({
    content: notificationBody.message,
    type,
    receiver: counterpart,
  });

  await notification.save();

  const counterpartConnection = CONNECTED_USERS[counterpart];

  if (!counterpartConnection) return;

  io.to(counterpartConnection).emit(type, {
    ...notificationBody,
    notification,
  });
};
