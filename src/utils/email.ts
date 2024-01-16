import nodemailer from "nodemailer";
import { generateErrorMesaage } from "./common";

const transporter = nodemailer.createTransport({
  host: process.env.ELASTIC_EMAIL_SERVER,
  secure: false,
  port: process.env.ELASTIC_EMAIL_PORT,
  auth: {
    user: process.env.ELASTIC_EMAIL_USER,
    pass: process.env.ELASTIC_EMAIL_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
  },
} as nodemailer.TransportOptions);

export const sendEmail = async (to: string, link: string, fullName: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.ELASTIC_EMAIL_USER,
      to,
      subject: "Yariga email verification",
      html: `
        <h3>Greetings, ${fullName}!</h3>
        <p>We are thrilled that you've decided to join Yariga.</p>
        <p>In order to fully experience the platform confirm your email
         by opening the link below:
        </p>
        <a href=${link}>${link}</a>
      `,
    });

    return info;
  } catch (e) {
    throw new Error(generateErrorMesaage(e));
  }
};
