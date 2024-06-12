import { Schema, model } from "mongoose";

const ChatSchema = new Schema({
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  participants: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    required: true,
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
});

export default model("Chat", ChatSchema);
