import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

import { connectToDatabase } from "./utils/database";
import AuthRouter from "./routes/auth";
import PropertyRouter from "./routes/property";
import AgreementRouter from "./routes/agreement";
import VerificationRouter from "./routes/verification";
import ProfileRouter from "./routes/profile";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", AuthRouter);
app.use("/property", PropertyRouter);
app.use("/agreements", AgreementRouter);
app.use("/verification", VerificationRouter);
app.use("/profile", ProfileRouter);

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

import "./socket";

connectToDatabase();
server.listen(5001);
