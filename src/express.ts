import express from "express";
import helmet from "helmet";
import cors from "cors";

import AuthRouter from "./routes/auth";
import PropertyRouter from "./routes/property";
import AgreementRouter from "./routes/agreements";
import VerificationRouter from "./routes/verification";
import ProfileRouter from "./routes/profile";
import ChatRouter from "./routes/chats";
import MessageRouter from "./routes/messages";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", AuthRouter);
app.use("/property", PropertyRouter);
app.use("/agreements", AgreementRouter);
app.use("/verification", VerificationRouter);
app.use("/profile", ProfileRouter);
app.use("/chats", ChatRouter);
app.use("/messages", MessageRouter);

export default app;
