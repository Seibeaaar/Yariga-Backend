import { NOTIFICATION_TYPE } from "@/enums/notification";

export type Notification = {
  id: string;
  content: string;
  type: NOTIFICATION_TYPE;
  receiver: string;
};
