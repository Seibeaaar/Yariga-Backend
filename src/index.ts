import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

import { connectToDatabase } from "./utils/database";
import AuthRouter from "./routes/auth";

const app = express();

app.use(helmet());
app.use(express.json());

app.use("/auth", AuthRouter);

connectToDatabase();
app.listen(5001);
