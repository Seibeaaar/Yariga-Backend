import { validateEmail } from "@/validators/verification";
import { Schema, model } from "mongoose";

const EmailVerificationSchema = new Schema({
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: validateEmail,
      message: "invalid email",
    },
  },
});

export default model("EmailVerification", EmailVerificationSchema);
