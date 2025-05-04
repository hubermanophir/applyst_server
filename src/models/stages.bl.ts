import { Stage } from "@prisma/client";
import { Base } from "../types/base.bl";
import prisma from "../services/prisma.service";

class StagesBL implements Base<Stage> {
  static instance: StagesBL;
  static getInstance(): StagesBL {
    if (!StagesBL.instance) {
      StagesBL.instance = new StagesBL();
    }
    return StagesBL.instance;
  }

  async getById(id: string, user_id: number): Promise<Stage> {
    const stage = await prisma.stage.findUnique({
      where: { id: Number(id), user_id },
    });
    if (!stage) {
      throw new Error("Stage not found");
    }
    return stage;
  }

  async getMany(
    filter: Partial<Stage>,
    options?: {
      take?: number;
      skip?: number;
      select?: Partial<Record<keyof Stage, boolean>>;
    }
  ): Promise<Stage[]> {
    const stages = await prisma.stage.findMany({
      where: filter,
      ...options,
    });
    return stages;
  }

  async update(id: string, data: Partial<Stage>): Promise<Stage> {
    const { name, position } = data;
    const stage = await prisma.stage.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(position && { position }),
      },
    });
    return stage;
  }

  async create(
    data: Pick<Stage, "name" | "position" | "user_id">
  ): Promise<Stage> {
    const stage = await prisma.stage.create({
      data,
    });
    return stage;
  }

  async delete(id: string, user_id: number): Promise<Stage> {
    const stage = await prisma.stage.delete({
      where: { id: Number(id), user_id },
    });
    return stage;
  }
}

export default StagesBL;
