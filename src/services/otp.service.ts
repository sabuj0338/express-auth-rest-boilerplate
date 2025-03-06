import status from "http-status";
import moment, { Moment } from "moment";
import env from "../config/env";
import {
  IOtpDoc,
  default as OTP,
  default as Otp,
  otpType,
} from "../models/otp.model";
import { IUserDoc } from "../models/user.model";
import ApiError from "../utils/ApiError";
import { getUserByEmail } from "./user.service";

export const generateOTP = (): number =>
  Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

export const saveOTP = async (
  otp: number,
  userId: string,
  expires: Moment,
  type: string,
  blacklisted: boolean = false
): Promise<IOtpDoc> => {
  const doc = await Otp.create({
    otp,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return doc;
};

export const verifyOTP = async (
  otp: number,
  userId: string,
  type: string
): Promise<IOtpDoc> => {
  const doc = await OTP.findOne({
    otp,
    type,
    user: userId,
    blacklisted: false,
  });
  if (!doc) {
    throw new ApiError(status.BAD_REQUEST, "Invalid OTP");
  }
  return doc;
};

export const generateResetPasswordOTP = async (
  email: string
): Promise<number> => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(status.BAD_REQUEST, "Invalid email");
  }
  const expires = moment().add(
    env.jwt.resetPasswordExpirationMinutes,
    "minutes"
  );
  const resetPasswordOTP = generateOTP();
  await saveOTP(resetPasswordOTP, user.id, expires, otpType.RESET_PASSWORD);
  return resetPasswordOTP;
};

export const generateVerifyEmailOTP = async (
  user: IUserDoc
): Promise<number> => {
  const expires = moment().add(env.jwt.verifyEmailExpirationMinutes, "minutes");
  const verifyEmailOTP = generateOTP();
  await saveOTP(verifyEmailOTP, user.id, expires, otpType.VERIFY_EMAIL);
  return verifyEmailOTP;
};
