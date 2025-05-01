import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authentication token is missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { uid } = verifyToken<{ uid: number }>(token);
    (req as Request & { uid: number }).uid = uid;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
