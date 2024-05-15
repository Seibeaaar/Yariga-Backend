import { Schema, model } from "mongoose";
import { NOTIFICATION_TYPES } from "@/constants/notification";

const NotificationSchema = new Schema({
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  read: {
    type: Boolean,
    default: false,
  },
  issuer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: {
      values: NOTIFICATION_TYPES,
    },
  },
  content: {
    type: String,
    required: true,
  },
});

export default model("Notification", NotificationSchema);
