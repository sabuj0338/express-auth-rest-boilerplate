import { NextFunction, Request, Response } from "express";
import status from "http-status";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { IPayload } from "../models/token.model";
import ApiError from "../utils/ApiError";
import { errorResponse } from "../utils/responseHandler";

export const acp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError(status.BAD_REQUEST, "Access denied. No token provided.");

    const decoded = jwt.verify(token, env.jwt.secret as string) as IPayload;
    
    // const user = await User.findById(decoded.sub).select("-password");
    // if (!user) throw new ApiError(status.BAD_REQUEST, "User not found.");
    // req.user = user;

    req.auth = decoded;
    next();
  } catch (error) {
    errorResponse(
      res,
      (error as Error).message || "Something went wrong.",
      status.BAD_REQUEST
    );
  }
};
