import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import status from "http-status";
import morgan from "morgan";
import passport from "passport";
import connectDB from "./config/db";
import env from "./config/env";
import jwtStrategy from "./config/jwt";
import connectSMTP from "./config/smtp";
import { errorConverter, errorHandler } from "./middlewares/error.middleware";
import authLimiter from "./middlewares/rateLimiter.middleware";
import routes from "./routes";
import ApiError from "./utils/ApiError";

dotenv.config();

const app: Application = express();

// Middleware

// HTTP request logger middleware for node.js
if (env.env === "production") {
  app.use(morgan("combined"));
} else if (env.env === "development") {
  app.use(morgan("dev"));
} else if (env.env === "test") {
  app.use(morgan("tiny"));
}

// set security HTTP headers
app.use(helmet());

// enable cors
// app.use(cors());
app.use(
  cors({
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    credentials: true, // Allow sending cookies with the request
  }),
);

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
// app.use(xss());
app.use(ExpressMongoSanitize());

// gzip compression
app.use(compression());

// parse cookies
app.use(cookieParser(env.cookie.secret));

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
if (env.env === "production") {
  app.use("/v1/auth", authLimiter);
}

// Routes
app.use("/api", routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(status.NOT_FOUND, "Not Found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// Database Connection
connectDB();

// SMTP Connection
connectSMTP();

export default app;
