import rateLimit from "express-rate-limit";
import status from "http-status";
import ApiError from "../utils/ApiError";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 requests
  skipSuccessfulRequests: true,
  statusCode: status.TOO_MANY_REQUESTS,
  message: "Too many failed login attempts, please try again after 15 minutes",
  handler: (_req, _res, next, options) => {
    next(new ApiError(options.statusCode, options.message));
  },
});

export default authLimiter;
