import { Request, Response } from "express";
import StagesBL from "../models/stages.bl";

export const getStages = async (
  req: Request & { uid?: number },
  res: Response
) => {
  if (!req.uid) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const stages = await StagesBL.getInstance().getMany(
    { user_id: req.uid },
    {
      select: {
        name: true,
        id: true,
        position: true,
      },
    }
  );
  res.status(200).json({ stages });
};

export const createStage = async (
  req: Request & { uid?: number },
  res: Response
) => {
  const { uid } = req as Request & { uid?: number };
  if (!uid) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { name, position } = req.body;
  console.log({ name, position });
  if (!name || typeof position !== "number") {
    res.status(400).json({ message: "Name and position are required" });
    return;
  }
  const stage = await StagesBL.getInstance().create({
    name,
    position,
    user_id: uid,
  });
  res.status(201).json({ stage });
};

export const createInitialStages = async (
  req: Request & { uid?: number },
  res: Response
) => {
  const { uid } = req as Request & { uid?: number };
  if (!uid) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { stages } = req.body;
  if (!Array.isArray(stages) || stages.length === 0) {
    res
      .status(400)
      .json({ message: "Stages array is required and cannot be empty" });
    return;
  }
  const stageBl = StagesBL.getInstance();
  const createdStages = await Promise.all(
    stages.map((stage: { name: string; position: number }) =>
      stageBl.create({
        ...stage,
        user_id: uid,
      })
    )
  );

  res.status(201).json({ stages: createdStages });
};
