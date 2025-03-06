import { NextFunction, Request, Response } from "express";
import status from "http-status";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { IPayload } from "../models/token.model";
import User from "../models/user.model";
import { errorResponse } from "../utils/responseHandler";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new Error("Access denied. No token provided.");

    const decoded = jwt.verify(token, env.jwt.secret as string) as IPayload;
    
    const user = await User.findById(decoded.sub).select("-password");
    if (!user) throw new Error("User not found.");

    req.user = user;
    next();
  } catch (error) {
    errorResponse(
      res,
      (error as Error).message || "Something went wrong.",
      status.BAD_REQUEST
    );
  }
};

export default authMiddleware;
