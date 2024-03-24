import { NOTIFICATION_EVENT, NOTIFICATION_TYPE } from "@/enums/notification";
import { User } from "@/types/user";
import Notification from "@/models/Notification";
import { Property } from "@/types/property";
import { getFullName } from "./common";

export const prepareSalesNotificationText = (
  buyerName: string,
  sellerName: string,
  propertyName: string,
  event: NOTIFICATION_EVENT,
) => {
  switch (event) {
    case NOTIFICATION_EVENT.NewSales:
      return `${buyerName} proposes a new offer for ${propertyName}. Please check it out.`;
    case NOTIFICATION_EVENT.AcceptedSales:
      return `${sellerName} accepts your offer for ${propertyName}`;
    case NOTIFICATION_EVENT.DeclinedSales:
      return `${sellerName} declines your offer for ${propertyName}`;
    case NOTIFICATION_EVENT.UpdatedSales:
      return `${buyerName} updates the offer for ${propertyName}. Get familiar with all updates.`;
    case NOTIFICATION_EVENT.SuggestedSales:
      return `${sellerName} suggests updates to the offer for ${propertyName}. Please check it out.`;
  }
};

export const generateSalesNotification = async (
  buyer: User,
  seller: User,
  property: Property,
  event: NOTIFICATION_EVENT,
  type: NOTIFICATION_TYPE,
) => {
  const notificationBody = prepareSalesNotificationText(
    getFullName(buyer),
    getFullName(seller),
    property.name,
    event,
  );
  const notification = new Notification({
    body: notificationBody,
    receiver: [
      NOTIFICATION_EVENT.NewSales,
      NOTIFICATION_EVENT.UpdatedSales,
    ].includes(event)
      ? buyer.id
      : seller.id,
    type,
  });
  await notification.save();
  return notification;
};
