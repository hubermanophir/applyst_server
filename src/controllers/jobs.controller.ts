import { Request, Response } from "express";
import JobsBL from "../models/jobs.bl";

export const getJobs = async (
  req: Request & { uid?: number },
  res: Response
) => {
  if (!req.uid) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const jobs = await JobsBL.getInstance().getMany(
    { user_id: req.uid },
    {
      select: {
        company_name: true,
        id: true,
        title: true,
        stage_id: true,
        date_submitted: true,
      },
    }
  );
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
  const job = await JobsBL.getInstance().getById(id, req.uid);
  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }
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
    contact,
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
  const job = await JobsBL.getInstance().create({
    title,
    company_name,
    date_submitted: new Date(date_submitted),
    stage_id: Number(stage_id),
    job_post_url,
    resume: resume || null,
    user_id: uid,
    contact: contact || null,
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

  const job = await JobsBL.getInstance().update(id, {
    title,
    company_name,
    date_submitted: new Date(date_submitted),
    stage_id: Number(stage_id),
    job_post_url,
    resume,
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
  const job = await JobsBL.getInstance().delete(id, uid);
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
