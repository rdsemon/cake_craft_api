import express from "express";
import morgan from "morgan";
import cakeRouter from "./routes/cake.routes";
import authRouter from "./routes/auth.routes";
import allRouteError from "./middlewares/catchRouteError";
const app = express();

app.use(express.json({ limit: "120kb" }));
app.use(morgan("dev"));

app.use("/api/v1", cakeRouter);
app.use("/api/v1/auth", authRouter);
app.use(allRouteError);

export default app;
