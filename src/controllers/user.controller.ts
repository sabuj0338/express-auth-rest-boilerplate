import { Request, Response } from "express";
import status from "http-status";
import * as userService from "../services/user.service";
import { catchAsync } from "../utils/catchAsync";
import { successResponse } from "../utils/responseHandler";

export const createNewUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.createUser(req.body);
  successResponse(res, "New user created successfully", status.CREATED);
});