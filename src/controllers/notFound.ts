import { Request, Response } from "express";

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    message: "Not Found",
    error: {
      status: 404,
      message: "The requested resource was not found",
    },
  });
};
