import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  read: {
    type: Boolean,
    default: false,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
  media: {
    type: String,
  },
  responseTo: {
    type: Schema.Types.ObjectId,
    ref: "Message",
    default: undefined,
  },
  chat: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
});

export default model("Message", MessageSchema);
