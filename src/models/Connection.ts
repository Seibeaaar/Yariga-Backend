import { Schema, model } from "mongoose";

const ConnectionSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  socket: {
    type: String,
    required: true,
  },
});

export default model("Connection", ConnectionSchema);
