import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";

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

connectToDatabase();
app.listen(5001);
