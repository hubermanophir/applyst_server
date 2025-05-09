import { Router } from "express";
import {
  createInitialStages,
  createStage,
  getUserStagesWithJobs,
} from "../../controllers/stages.controller";

const stagesRouter = Router();

stagesRouter.get("/", getUserStagesWithJobs);
stagesRouter.post("/", createStage);
stagesRouter.post("/initial", createInitialStages);

export default stagesRouter;
