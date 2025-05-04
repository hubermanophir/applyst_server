import { Router } from "express";
import {
  createInitialStages,
  createStage,
  getStages,
} from "../../controllers/stages.controller";

const stagesRouter = Router();

stagesRouter.get("/", getStages);
stagesRouter.post("/", createStage);
stagesRouter.post("/initial", createInitialStages);

export default stagesRouter;
