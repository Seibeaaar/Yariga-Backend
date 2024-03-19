import { Schema, model } from "mongoose";
import { NOTIFICATION_TYPE } from "@/enums/notification";

const NotificationSchema = new Schema({
  type: {
    type: String,
    enum: Object.values(NOTIFICATION_TYPE),
    required: true,
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  body: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

export default model("Notification", NotificationSchema);
