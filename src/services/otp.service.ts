import moment, { Moment } from "moment";
import env from "../config/env";
import { IOtpDoc, default as OTP, default as Otp, otpType } from "../models/otp.model";
import { IUserDoc } from "../models/user.model";
import { getUserByEmail } from "./user.service";

/**
 * Generate otp
 * @returns {number}
 */
export const generateOTP = (): number =>
  Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

/**
 * Save a otp
 * @param {number} otp
 * @param {string} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<IOtpDoc>}
 */
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

/**
 * Verify otp and return otp doc (or throw an error if it is not valid)
 * @param {number} otp
 * @param {string} type
 * @param {string} userId
 * @returns {Promise<IOtpDoc>}
 */
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
    throw new Error("Invalid OTP");
  }
  return doc;
};

/**
 * Generate reset password otp
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordOTP = async (
  email: string
): Promise<number> => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("");
    // throw new ApiError(httpStatus.NO_CONTENT, "");
  }
  const expires = moment().add(
    env.jwt.resetPasswordExpirationMinutes,
    "minutes"
  );
  const resetPasswordOTP = generateOTP();
  await saveOTP(resetPasswordOTP, user.id, expires, otpType.RESET_PASSWORD);
  return resetPasswordOTP;
};

/**
 * Generate verify email token
 * @param {IUserDoc} user
 * @returns {Promise<string>}
 */
export const generateVerifyEmailOTP = async (
  user: IUserDoc
): Promise<number> => {
  const expires = moment().add(
    env.jwt.verifyEmailExpirationMinutes,
    "minutes"
  );
  const verifyEmailOTP = generateOTP();
  await saveOTP(verifyEmailOTP, user.id, expires, otpType.VERIFY_EMAIL);
  return verifyEmailOTP;
};
