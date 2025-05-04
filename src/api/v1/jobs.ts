import { Router } from "express";
import { getJobs, createJob } from "../../controllers/jobs.controller";

const jobsRouter = Router();

jobsRouter.get("/", getJobs);

jobsRouter.post("/", createJob);

export default jobsRouter;
