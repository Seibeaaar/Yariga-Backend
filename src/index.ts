import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

import { connectToDatabase } from "./utils/database";
import AuthRouter from "./routes/auth";
import SolePropRouter from "./routes/soleProp";
import PropertyRouter from "./routes/property";

const app = express();

app.use(helmet());
app.use(express.json());

app.use("/auth", AuthRouter);
app.use("/soleProp", SolePropRouter);
app.use("/property", PropertyRouter);

connectToDatabase();
app.listen(5001);
