import { NextFunction, Request, Response } from "express";
import status from "http-status";
import mongoose from "mongoose";
import env from '../config/env';
import ApiError from "../utils/ApiError";
import logger from "../utils/logger";
import { errorResponse } from "../utils/responseHandler";

export const errorConverter = (
  err: any,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? status.BAD_REQUEST
        : status.INTERNAL_SERVER_ERROR;
    const message: string = error.message || `${status[statusCode]}`;
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let { statusCode, message } = err;
  if (env.env === "production" && !err.isOperational) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = "Internal Server Error";
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(env.env === "development" && { stack: err.stack }),
  };

  if (env.env === "development") {
    logger.error(err);
  }

  errorResponse(res, response.message, statusCode);

  // res.status(statusCode).send(response);
};
