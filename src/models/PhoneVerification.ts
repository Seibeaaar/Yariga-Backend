import { Schema, model } from "mongoose";

const PhoneVerificationSchema = new Schema({
  phoneNumber: String,
  verificationCode: String,
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
});

export default model("PhoneVerification", PhoneVerificationSchema);
