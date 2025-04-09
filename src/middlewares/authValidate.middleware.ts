import { body } from "express-validator";
import status from "http-status";
import ApiError from "../utils/ApiError";

// create validation rules for registration
export const vRegistration = [
  body("fullName").notEmpty().withMessage("Full Name is required"),
  // body("username")
  //   .notEmpty()
  //   .withMessage("Username is required")
  //   .isLength({ min: 3, max: 30 })
  //   .withMessage("Username must be between 3 and 30 characters")
  //   .matches(/^[a-zA-Z0-9_]+$/)
  //   .withMessage(
  //     "Username can only contain alphanumeric characters and underscores"
  //   ),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      "Password must contain at least one uppercase, one lowercase, one number and one special character"
    ),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new ApiError(status.BAD_REQUEST, "Passwords do not match");
      }
      return true;
    }),
];

// profile update
export const vUpdateProfile = [
  body("fullName").optional().notEmpty().withMessage("Full Name is required"),
  body("avatar").optional().isURL().withMessage("Valid URL is required"),
  body("phoneNumber").optional().isMobilePhone("any").withMessage("Valid phone number is required"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
];

// create validation rules for login
export const vLogin = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// logout
export const vLogout = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

// refresh token
export const vRefreshToken = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

// forgot password
export const vForgotPassword = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
];

// reset password
export const vResetPassword = [
  body("otp").notEmpty().withMessage("OTP is required"),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      "Password must contain at least one uppercase, one lowercase, one number and one special character"
    ),
];

// verify email
export const vVerifyEmail = [
  body("otp").notEmpty().withMessage("OTP is required"),
];

// update password
export const vUpdatePassword = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      "Password must contain at least one uppercase, one lowercase, one number and one special character"
    ),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new ApiError(status.BAD_REQUEST, "Passwords do not match");
      }
      return true;
    }),
];