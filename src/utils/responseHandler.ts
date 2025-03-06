import { Response } from "express";

export const successResponse = (res: Response, data: any, message = "Success", statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res: Response, message = "Error", statusCode = 500, errors: any = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
