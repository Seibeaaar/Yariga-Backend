import twilio from "twilio";
import { generateErrorMesaage } from "./common";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export const sendSMS = async (to: string, body: string) => {
  try {
    const message = await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    return message.sid;
  } catch (e) {
    const errorInfo = generateErrorMesaage(e);
    throw new Error(errorInfo);
  }
};

export const generateVerificationCode = () =>
  [...Array(6)].map(() => (Math.random() * 10) | 0).join("");
