import { Request, Response } from "express";
import prisma from "../services/prisma.service";

export const getJobs = async (
  req: Request & { uid?: number },
  res: Response
) => {
  if (!req.uid) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const jobs = await prisma.job.findMany({
    where: { user_id: req.uid },
    select: { id: true, title: true, company_name: true, date_submitted: true },
  });
  res.status(200).json({ jobs });
};
export const getJob = async (
  req: Request & { uid?: number },
  res: Response
) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Job ID is required" });
    return;
  }
  if (!req.uid) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const job = await prisma.job.findUnique({
    where: { id: Number(id), user_id: req.uid },
    select: { id: true, title: true, company_name: true, date_submitted: true },
  });
  res.status(200).json({ job });
};
export const createJob = async (req: Request, res: Response) => {
  const { uid } = req as Request & { uid?: number };
  if (!uid) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const {
    title,
    company_name,
    date_submitted,
    stage_id,
    job_post_url,
    resume,
  } = req.body;

  const missingFields = getRequiredMissingFields(
    ["title", "company_name", "date_submitted", "stage_id"],
    req.body
  );

  if (missingFields.length > 0) {
    res.status(400).json({
      message: "Missing required fields",
      missingFields,
    });
    return;
  }

  const job = await prisma.job.create({
    data: {
      title,
      company_name,
      date_submitted: new Date(date_submitted),
      stage_id: Number(stage_id),
      job_post_url,
      resume,
      user_id: uid,
    },
  });
  if (!job) {
    res.status(500).json({ message: "Failed to create job" });
    return;
  }
  res.status(201).json({ message: "Job created successfully" });
};
export const updateJob = async (req: Request, res: Response) => {
  const { uid } = req as Request & { uid?: number };
  if (!uid) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Job ID is required" });
    return;
  }
  const {
    title,
    company_name,
    date_submitted,
    stage_id,
    job_post_url,
    resume,
  } = req.body;

  const job = await prisma.job.update({
    where: { id: Number(id), user_id: uid },
    data: {
      ...(title && { title }),
      ...(company_name && { company_name }),
      ...(date_submitted && { date_submitted: new Date(date_submitted) }),
      ...(stage_id && { stage_id: Number(stage_id) }),
      ...(job_post_url && { job_post_url }),
      ...(resume && { resume }),
    },
  });
  if (!job) {
    res.status(500).json({ message: "Failed to update job" });
    return;
  }
  res.status(200).json({ message: "Job updated successfully" });
  return;
};

export const deleteJob = async (req: Request, res: Response) => {
  const { uid } = req as Request & { uid?: number };
  if (!uid) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Job ID is required" });
    return;
  }
  const job = await prisma.job.delete({
    where: { id: Number(id), user_id: uid },
  });
  if (!job) {
    res.status(500).json({ message: "Failed to delete job" });
    return;
  }
  res.status(200).json({ message: "Job deleted successfully" });
};

const getRequiredMissingFields = (
  requiredFields: string[],
  body: Record<string, any>
): string[] => {
  const missingFields = requiredFields.filter(
    (field) => !body[field] || body[field] === ""
  );
  return missingFields;
};
