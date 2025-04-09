import status from "http-status";
import jwt from "jsonwebtoken";
import moment, { Moment } from "moment";
import env from "../config/env";
import Token, {
  AccessAndRefreshTokens,
  ITokenDoc,
  tokenType,
} from "../models/token.model";
import { IUserDoc } from "../models/user.model";
import ApiError from "../utils/ApiError";
import { getUserByEmail } from "./user.service";

export const generateToken = (
  userId: string,
  expires: Moment,
  type: string,
  secret: string = env.jwt.secret
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

export const saveToken = async (
  token: string,
  userId: string,
  expires: Moment,
  type: string,
  blacklisted: boolean = false
): Promise<ITokenDoc> => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

export const verifyToken = async (
  token: string,
  type: string
): Promise<ITokenDoc> => {
  const payload = jwt.verify(token, env.jwt.secret);
  if (typeof payload.sub !== "string") {
    throw new ApiError(status.BAD_REQUEST, "bad user");
  }
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new ApiError(status.BAD_REQUEST, "Token not found");
  }
  return tokenDoc;
};

export const generateAuthTokens = async (
  user: IUserDoc
): Promise<AccessAndRefreshTokens> => {
  const accessTokenExpires = moment().add(
    env.jwt.accessExpirationMinutes,
    "minutes"
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenType.ACCESS
  );

  const refreshTokenExpires = moment().add(
    env.jwt.refreshExpirationDays,
    "days"
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    tokenType.REFRESH
  );
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenType.REFRESH
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const generateResetPasswordToken = async (
  email: string
): Promise<string> => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(status.BAD_REQUEST, "Invalid email");
  }
  const expires = moment().add(
    env.jwt.resetPasswordExpirationMinutes,
    "minutes"
  );
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    tokenType.RESET_PASSWORD
  );
  await saveToken(
    resetPasswordToken,
    user.id,
    expires,
    tokenType.RESET_PASSWORD
  );
  return resetPasswordToken;
};

export const generateVerifyEmailToken = async (
  user: IUserDoc
): Promise<string> => {
  const expires = moment().add(env.jwt.verifyEmailExpirationMinutes, "minutes");
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    tokenType.VERIFY_EMAIL
  );
  await saveToken(verifyEmailToken, user.id, expires, tokenType.VERIFY_EMAIL);
  return verifyEmailToken;
};
