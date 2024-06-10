import { NOTIFICATION_TYPE } from "@/enums/notification";

export type NotificationData = {
  id: string;
  content: string;
  receiver: string;
  sender: string;
  type: NOTIFICATION_TYPE;
  createdAt: string;
};
