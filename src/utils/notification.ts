import { NOTIFICATION_EVENT } from "@/enums/notification";

export const generateSalesNotification = (
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
