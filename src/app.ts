import express, { Application } from "express";
import loggerMiddleware from "./middlewares/loggerMiddleware";

const app: Application = express();
app.use(express.json());

app.use(loggerMiddleware);
app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

export default app;
