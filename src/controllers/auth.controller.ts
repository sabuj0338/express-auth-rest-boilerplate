import { Request, Response } from "express";
import status from "http-status";
import * as authService from "../services/auth.service";
import * as emailService from "../services/email.service";
import * as otpService from "../services/otp.service";
import * as tokenService from "../services/token.service";
import * as userService from "../services/user.service";
import ApiError from "../utils/ApiError";
import { catchAsync } from "../utils/catchAsync";
import { successResponse } from "../utils/responseHandler";

export const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.registerUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  successResponse(res, "User registered successfully", status.CREATED, { user, tokens });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  successResponse(res, "User logged in successfully", status.OK, { user, tokens });
});
  
export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  successResponse(res, "User logged out successfully", status.NO_CONTENT);
});
  
export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken);
  successResponse(res, "Tokens refreshed successfully", status.OK, { ...userWithTokens })
});
  
export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const resetPasswordOTP = await otpService.generateResetPasswordOTP(req.body.email);
  await emailService.sendResetPasswordEmailByOTP(req.body.email, resetPasswordOTP);
  successResponse(res, "OTP sent successfully", status.NO_CONTENT)
});
  
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserByEmail(req.body.email);
  if (!user) throw new ApiError(status.BAD_REQUEST, "User with this email does not exist");
  
  await authService.resetPasswordByOTP(req.body.otp, user.id, req.body.password);
  successResponse(res, "Password updated successfully", status.NO_CONTENT)
});
  
export const sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
  const verifyEmailOTP = await otpService.generateVerifyEmailOTP(req.user);
  await emailService.sendVerificationEmailByOTP(req.user.email, verifyEmailOTP, req.user.username);
  successResponse(res, "OTP sent successfully", status.NO_CONTENT)
});
  
export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserByEmail(req.user.email);
  if (!user) throw new ApiError(status.BAD_REQUEST, "User with this email does not exist");
  await authService.verifyEmailByOTP(req.body.otp, user.id);
  successResponse(res, "Email verified successfully", status.NO_CONTENT)
});
