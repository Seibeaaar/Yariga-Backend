import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import { connectToDatabase } from "./utils/database";
import AuthRouter from "./routes/auth";
import SolePropRouter from "./routes/soleProp";
import PropertyRouter from "./routes/property";
import SalesRouter from "./routes/sales";
import VerificationRouter from "./routes/verification";
import ProfileRouter from "./routes/profile";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", AuthRouter);
app.use("/soleProp", SolePropRouter);
app.use("/property", PropertyRouter);
app.use("/sales", SalesRouter);
app.use("/verification", VerificationRouter);
app.use("/profile", ProfileRouter);

connectToDatabase();
app.listen(5001);
