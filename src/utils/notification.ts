import { NOTIFICATION_TYPE } from "@/enums/notification";
import { Property } from "@/types/property";
import { Profile } from "@/types/profile";
import { Agreement } from "@/types/agreement";
import Notification from "@/models/Notification";
import { generateErrorMesaage } from "./common";
import { getAgreementCounterpart } from "./agreement";
import { NotificationData } from "@/types/notification";
import { getCounterpartConnection } from "./socket";
import { io } from "..";

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

export class NotificationHandler {
  property: Property;
  profile: Profile;
  agreement: Agreement;
  type: NOTIFICATION_TYPE;
  constructor(
    property: Property,
    profile: Profile,
    agreement: Agreement,
    type: NOTIFICATION_TYPE,
  ) {
    this.property = property;
    this.profile = profile;
    this.agreement = agreement;
    this.type = type;
  }

  async createNotification() {
    const content = constructAgreementNotification(
      this.type,
      this.property.title,
    );
    const receiver = getAgreementCounterpart(this.agreement, this.profile.id);
    try {
      const notification = new Notification({
        content,
        sender: this.profile.id,
        receiver,
        type: this.type,
      });

      await notification.save();
      return notification;
    } catch (e) {
      throw new Error(generateErrorMesaage(e));
    }
  }

  async sendNotification(notification: NotificationData) {
    try {
      const counterpartConnection = await getCounterpartConnection(
        [this.agreement.seller, this.agreement.buyer],
        this.profile.id,
      );

      if (counterpartConnection) {
        io.to(counterpartConnection).emit(this.type, notification);
      }
    } catch (e) {
      throw new Error(generateErrorMesaage(e));
    }
  }
}
