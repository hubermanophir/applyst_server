import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const loggerMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction
): void => {
  logger.getInstance().info(`${req.method} ${req.url} `);
  next();
};

export default loggerMiddleware;
