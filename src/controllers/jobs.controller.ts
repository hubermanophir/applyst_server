import { Request, Response } from "express";

export const getJobs = (req: Request, res: Response) => {
  res.send("Get all jobs");
};
export const getJob = (req: Request, res: Response) => {
  res.send("Get a job");
};
export const createJob = (req: Request, res: Response) => {
  res.send("Create a job");
};
export const updateJob = (req: Request, res: Response) => {
  res.send("Update a job");
};
export const deleteJob = (req: Request, res: Response) => {
  res.send("Delete a job");
};
