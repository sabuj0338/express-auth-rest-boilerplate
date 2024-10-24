// import httpStatus from "http-status";
import mongoose from "mongoose";
import Token from "../token/token.model";
// import ApiError from "../errors/ApiError";
import tokenTypes from "../token/token.types";
import { getUserByEmail, getUserById, updateUserById } from "../user/user.service";
import { IUserDoc, IUserWithTokens } from "../user/user.interfaces";
import { generateAuthTokens, verifyToken } from "../token/token.service";
import { verifyOTP } from "../otp/otp.service";
import { OTP, otpTypes } from "../otp";

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUserDoc> => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new Error("Incorrect email or password");
    // throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new Error("Not found");
    // throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await refreshTokenDoc.deleteOne();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IUserWithTokens>}
 */
export const refreshAuth = async (refreshToken: string): Promise<IUserWithTokens> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await getUserById(new mongoose.Types.ObjectId(refreshTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.deleteOne();
    const tokens = await generateAuthTokens(user);
    return { user, tokens };
  } catch (error) {
    throw new Error("Please authenticate");
    // throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (resetPasswordToken: any, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await getUserById(new mongoose.Types.ObjectId(resetPasswordTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new Error("Password reset failed");
    // throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

/**
 * Reset password
 * @param {number} resetPasswordOTP
 * @param {string} userId
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPasswordByOTP = async (resetPasswordOTP: number, userId: string, newPassword: string): Promise<void> => {
  try {
    const uid = new mongoose.Types.ObjectId(userId);
    await verifyOTP(resetPasswordOTP, userId, otpTypes.RESET_PASSWORD);
    await updateUserById(uid, { password: newPassword });
    await OTP.deleteMany({ user: uid, type: otpTypes.RESET_PASSWORD });
  } catch (error) {
    throw new Error("Password reset failed");
    // throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

/**
 * Verify email
 * @param {number} verifyEmailOTP
 * @param {string} userId
 * @returns {Promise<IUserDoc | null>}
 */
export const verifyEmailByOTP = async (verifyEmailOTP: number, userId: string): Promise<IUserDoc | null> => {
  try {
    const uid = new mongoose.Types.ObjectId(userId);
    await verifyOTP(verifyEmailOTP, userId, otpTypes.VERIFY_EMAIL);
    await OTP.deleteMany({ user: uid, type: otpTypes.VERIFY_EMAIL });
    const updatedUser = await updateUserById(uid, { isEmailVerified: true });
    return updatedUser;
  } catch (error) {
    throw new Error("Email verification failed");
    // throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<IUserDoc | null>}
 */
export const verifyEmail = async (verifyEmailToken: any): Promise<IUserDoc | null> => {
  try {
    const verifyEmailTokenDoc = await verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await getUserById(new mongoose.Types.ObjectId(verifyEmailTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    const updatedUser = await updateUserById(user.id, { isEmailVerified: true });
    return updatedUser;
  } catch (error) {
    throw new Error("Email verification failed");
    // throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};
