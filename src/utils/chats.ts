import { CHAT_EVENTS } from "@/enums/chats";
import Notification from "@/models/Notification";
import { Profile } from "@/types/profile";
import { constructMessageNotification } from "./notification";
import { buildFullName } from "./profile";
import { NOTIFICATION_TYPE } from "@/enums/notification";
import { generateErrorMesaage } from "./common";
import { MessageData } from "@/types/chats";
import { emitEvent } from "./socket";

export const emitChatEventToCounterpart = async (
  type: CHAT_EVENTS,
  senderProfile: Profile,
  receiver: string,
  data: MessageData | string,
) => {
  try {
    const notificationContent = constructMessageNotification(
      buildFullName(senderProfile),
    );

    const notification = new Notification({
      sender: senderProfile.id,
      receiver,
      content: notificationContent,
      type: NOTIFICATION_TYPE.Message,
    });

    await notification.save();

    await emitEvent(
      {
        notification,
        data,
      },
      receiver,
      type,
    );
  } catch (e) {
    throw new Error(generateErrorMesaage(e));
  }
};
