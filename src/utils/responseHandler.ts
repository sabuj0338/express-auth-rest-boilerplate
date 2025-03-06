import { Response } from "express";

export const successResponse = (
  res: Response,
  message = "Success",
  statusCode = 200,
  data: any = null
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  message = "Error",
  statusCode = 500,
  errors: any = null
) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
