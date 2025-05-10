import { Router } from "express";
import { createJob, getJobs } from "../../controllers/jobs.controller";

const jobsRouter = Router();

jobsRouter.get("/", getJobs);
jobsRouter.post("/", createJob);

export default jobsRouter;
