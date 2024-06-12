import { Schema, model } from "mongoose";
import { NOTIFICATION_TYPE } from "@/enums/notification";

const NotificationSchema = new Schema({
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  content: {
    type: String,
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  type: {
    type: String,
    enum: {
      values: Object.values(NOTIFICATION_TYPE),
    },
  },
});

export default model("Notification", NotificationSchema);
