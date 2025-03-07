import { body } from "express-validator";
import status from "http-status";
import ApiError from "../utils/ApiError";

// create validation rules for registration
export const validateRegistration = [
  body("fullName").notEmpty().withMessage("Full Name is required"),
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "Username can only contain alphanumeric characters and underscores"
    ),
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

// create validation rules for login
export const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// logout
export const validateLogout = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

// refresh token
export const validateRefreshToken = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

// forgot password
export const validateForgotPassword = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
];

// reset password
export const validateResetPassword = [
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
export const validateVerifyEmail = [
  body("otp").notEmpty().withMessage("OTP is required"),
];

// auth update validation rules
export const validateProfileUpdate = [
  // body("fullName").notEmpty().withMessage("Full Name is required"),
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "Username can only contain alphanumeric characters and underscores"
    ),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
];