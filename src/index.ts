import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

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

const server = createServer(app);
// Exported for a use throughout the app
export const io = new Server(server);

server.listen(5001);
