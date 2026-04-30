import express from "express";
const app = express();

app.get("/", (req, res, next) => {
  res.send("Hello from the api");
});

export default app;
