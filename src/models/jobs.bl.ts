import { Job } from "@prisma/client";
import prisma from "../services/prisma.service";
import { Base } from "../types/base.bl";

class JobsBL implements Base<Job> {
  static instance: JobsBL;
  static getInstance(): JobsBL {
    if (!JobsBL.instance) {
      JobsBL.instance = new JobsBL();
    }
    return JobsBL.instance;
  }

  async getById(
    id: string,
    user_id: number,
    options?: { select: Partial<Record<keyof Job, boolean>> }
  ): Promise<Job> {
    const job = await prisma.job.findUnique({
      where: { id: Number(id), user_id, ...options },
    });
    if (!job) {
      throw new Error("Job not found");
    }
    return job;
  }

  async getMany(
    filter: Partial<Job>,
    options?: {
      take?: number;
      skip?: number;
      select?: Partial<Record<keyof Job, boolean>>;
    }
  ): Promise<Job[]> {
    const jobs = await prisma.job.findMany({
      where: filter,
      ...options,
    });
    return jobs;
  }

  async update(id: string, data: Partial<Job>): Promise<Job> {
    const {
      company_name,
      contact,
      date_submitted,
      job_post_url,
      resume,
      stage_id,
      title,
    } = data;
    const job = await prisma.job.update({
      where: { id: Number(id) },
      data: {
        ...(company_name && { company_name }),
        ...(contact && { contact }),
        ...(date_submitted && { date_submitted: new Date(date_submitted) }),
        ...(job_post_url && { job_post_url }),
        ...(resume && { resume }),
        ...(stage_id && { stage_id }),
        ...(title && { title }),
      },
    });
    return job;
  }

  async delete(id: string, user_id: number): Promise<Job> {
    const job = await prisma.job.delete({
      where: { id: Number(id), user_id },
    });
    return job;
  }

  async create(
    data: Pick<
      Job,
      | "title"
      | "company_name"
      | "date_submitted"
      | "stage_id"
      | "job_post_url"
      | "resume"
      | "contact"
      | "user_id"
    >
  ): Promise<Job> {
    const job = await prisma.job.create({
      data,
    });
    return job;
  }
}

export default JobsBL;
