import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

import { connectToDatabase } from "./utils/database";
import AuthRouter from "./routes/auth";
import SolePropRouter from "./routes/soleProp";

const app = express();

app.use(helmet());
app.use(express.json());

app.use("/auth", AuthRouter);
app.use("/soleProp", SolePropRouter);

connectToDatabase();
app.listen(5001);
