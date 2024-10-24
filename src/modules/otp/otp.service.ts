import moment, { Moment } from "moment";
import mongoose from "mongoose";
// import httpStatus from "http-status";
import config from "../../config/config";
import OTP from "./otp.model";
// import ApiError from "../errors/ApiError";
import otpTypes from "./otp.types";
import { IUserDoc } from "../user/user.interfaces";
import { userService } from "../user";
import { IOTPDoc } from "./otp.interfaces";

/**
 * Generate otp
 * @returns {number}
 */
export const generateOTP = (): number => Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

/**
 * Save a otp
 * @param {number} otp
 * @param {mongoose.Types.ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<IOTPDoc>}
 */
export const saveOTP = async (
  otp: number,
  userId: mongoose.Types.ObjectId,
  expires: Moment,
  type: string,
  blacklisted: boolean = false,
): Promise<IOTPDoc> => {
  const doc = await OTP.create({
    otp,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return doc;
};

/**
 * Verify otp and return otp doc (or throw an error if it is not valid)
 * @param {number} otp
 * @param {string} type
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IOTPDoc>}
 */
export const verifyOTP = async (otp: number, userId: string, type: string): Promise<IOTPDoc> => {
  const doc = await OTP.findOne({
    otp,
    type,
    user: userId,
    blacklisted: false,
  });
  if (!doc) {
    throw new Error("Invalid OTP");
  }
  return doc;
};

/**
 * Generate reset password otp
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordOTP = async (email: string): Promise<number> => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new Error("");
    // throw new ApiError(httpStatus.NO_CONTENT, "");
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, "minutes");
  const resetPasswordOTP = generateOTP();
  await saveOTP(resetPasswordOTP, user.id, expires, otpTypes.RESET_PASSWORD);
  return resetPasswordOTP;
};

/**
 * Generate verify email token
 * @param {IUserDoc} user
 * @returns {Promise<string>}
 */
export const generateVerifyEmailOTP = async (user: IUserDoc): Promise<number> => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, "minutes");
  const verifyEmailOTP = generateOTP();
  await saveOTP(verifyEmailOTP, user.id, expires, otpTypes.VERIFY_EMAIL);
  return verifyEmailOTP;
};
