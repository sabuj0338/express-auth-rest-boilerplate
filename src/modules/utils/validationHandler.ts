import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const validationHandler = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    return res.status(400).json({
      message: "Input validation failed",
      errors: mappedErrors,
    });
  }
};

export { validationHandler };
