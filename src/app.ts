import express from "express";
import morgan from "morgan";
import cakeRouter from "./routes/cake.routes";
const app = express();

app.use(express.json({ limit: "120kb" }));
app.use(morgan("dev"));

app.use("/api/v1", cakeRouter);

export default app;
