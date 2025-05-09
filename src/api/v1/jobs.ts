import { Router } from "express";
import { createJob } from "../../controllers/jobs.controller";

const jobsRouter = Router();

jobsRouter.post("/", createJob);

export default jobsRouter;
