// import httpStatus from "http-status";
import status from "http-status";
import Otp, { otpType } from "../models/otp.model";
import Token, { tokenType } from "../models/token.model";
import { IUser, IUserDoc, IUserWithTokens } from "../models/user.model";
import ApiError from "../utils/ApiError";
import logger from "../utils/logger";
import { verifyOTP } from "./otp.service";
import { generateAuthTokens, verifyToken } from "./token.service";
import { getUserByEmail, getUserById, updateUserById } from "./user.service";

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUser>}
 */
export const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<IUserDoc> => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(status.BAD_REQUEST, "Incorrect email or password");
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenType.REFRESH,
    blacklisted: false,
  });
  logger.info(refreshToken, refreshTokenDoc);
  if (!refreshTokenDoc) {
    throw new Error("Not found");
  }
  await refreshTokenDoc.deleteOne();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IUserWithTokens>}
 */
export const refreshAuth = async (
  refreshToken: string
): Promise<IUserWithTokens> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenType.REFRESH);
    const user = await getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error("Invalid token - please login again");
    }
    await refreshTokenDoc.deleteOne();
    const tokens = await generateAuthTokens(user);
    return { user, tokens };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (
  resetPasswordToken: any,
  newPassword: string
): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await verifyToken(
      resetPasswordToken,
      tokenType.RESET_PASSWORD
    );
    const user = await getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error("Invalid token - please login again");
    }
    await updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenType.RESET_PASSWORD });
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

/**
 * Reset password
 * @param {number} resetPasswordOTP
 * @param {string} userId
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPasswordByOTP = async (
  resetPasswordOTP: number,
  userId: string,
  newPassword: string
): Promise<void> => {
  try {
    await verifyOTP(resetPasswordOTP, userId, otpType.RESET_PASSWORD);
    await updateUserById(userId, { password: newPassword });
    await Otp.deleteMany({ user: userId, type: otpType.RESET_PASSWORD });
  } catch (error) {
    throw new Error("Password reset failed");
  }
};

/**
 * Verify email
 * @param {number} verifyEmailOTP
 * @param {string} userId
 * @returns {Promise<IUserDoc | null>}
 */
export const verifyEmailByOTP = async (
  verifyEmailOTP: number,
  userId: string
): Promise<IUserDoc | null> => {
  try {
    await verifyOTP(verifyEmailOTP, userId, otpType.VERIFY_EMAIL);
    await Otp.deleteMany({ user: userId, type: otpType.VERIFY_EMAIL });
    const updatedUser = await updateUserById(userId, { isEmailVerified: true });
    return updatedUser;
  } catch (error) {
    throw new Error("Email verification failed");
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<IUserDoc | null>}
 */
export const verifyEmail = async (
  verifyEmailToken: any
): Promise<IUserDoc | null> => {
  try {
    const verifyEmailTokenDoc = await verifyToken(
      verifyEmailToken,
      tokenType.VERIFY_EMAIL
    );
    const user = await getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error("Invalid token - please login again");
    }
    await Token.deleteMany({ user: user.id, type: tokenType.VERIFY_EMAIL });
    const updatedUser = await updateUserById(user.id, {
      isEmailVerified: true,
    });
    return updatedUser;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
