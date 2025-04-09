import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import status from "http-status";
import { errorResponse } from "../utils/responseHandler";

/**
 * Middleware to validate request using express-validator.
 * If validation fails, it sends a 422 response with validation errors.
 */
export const vr = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorResponse(res, "Validation failed", status.UNPROCESSABLE_ENTITY, errors.array());
    return; // Ensure function exits after sending response
  }
  next(); // Proceed if validation passes
};