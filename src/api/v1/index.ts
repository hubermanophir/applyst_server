import { Router } from "express";
import userRouter from "./users";
import authRouter from "./auth";
import jobsRouter from "./jobs";
import stagesRouter from "./stages";

const v1Router = Router();

v1Router.use("/users", userRouter);
v1Router.use("/auth", authRouter);
v1Router.use("/jobs", jobsRouter);
v1Router.use("/stages", stagesRouter);

export default v1Router;
