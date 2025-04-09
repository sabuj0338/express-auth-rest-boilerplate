import { NextFunction, Request, Response } from "express";
import { closeMongoDB, connectMongoDB } from "../config/db";
import logger from "./logger";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const catchAsync =
  (fn: AsyncRequestHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };

/**
 * Wraps an async Express request handler, managing MongoDB connection
 * (open before, close after) and catching async errors.
 * @param fn The async request handler function.
 * @returns An Express request handler.
 */
export const catchAsyncWithDB =
  (fn: AsyncRequestHandler) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let dbConnected = false; // Flag to track connection status
    try {
      await connectMongoDB();
      dbConnected = true;
      await fn(req, res, next); // Execute the controller logic
    } catch (err) {
      // If an error occurs during controller logic, pass it to the error handler
      next(err);
    } finally {
      // Ensure DB is closed if it was successfully connected
      if (dbConnected) {
        try {
          await closeMongoDB();
        } catch (closeErr) {
          // Log closing error but don't overwrite the original error passed to next()
          logger.error("Error closing MongoDB connection:", closeErr);
          // Optionally, you could decide to crash the process here if DB closing fails critically
          // process.exit(1);
        }
      }
    }
  };
