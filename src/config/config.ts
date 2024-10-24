import "dotenv/config";
import Joi from "joi";

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(4000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which verify email token expires"),
    SMTP_HOST: Joi.string().description("server that will send the emails"),
    SMTP_PORT: Joi.number().description("port to connect to the email server"),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    SMTP_PASSWORD: Joi.string().description("password for email server"),
    EMAIL_FROM: Joi.string().description(
      "the from field in the emails sent by the app",
    ),
    CLIENT_URL: Joi.string().required().description("Client url"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  cookie: {
    name: envVars.COOKIE_NAME,
    secret: envVars.COOKIE_SECRET,
    expire: envVars.COOKIE_EXPIRY,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    cookieOptions: {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      signed: true,
    },
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  clientUrl: envVars.CLIENT_URL,
};

export default config;
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";

// dotenv.config({ path: path.join(__dirname, "../.env") });

// const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
// const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
// const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "defaultdb";
// const MONGO_URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.fe3fmv3.mongodb.net/${process.env.MONGO_DB_NAME}`;

// const SERVER_PORT = process.env.PORT || 4000;

// const JWT_SECRET: string =
//   process.env.JWT_SECRET || "jamoncaytaikoramardekharkichunai";
// const JWT_EXPIRY: string = process.env.JWT_EXPIRY || "99999999";

// const COOKIE_NAME: string = process.env.COOKIE_NAME || "_auth";
// const COOKIE_SECRET: string =
//   process.env.COOKIE_SECRET || "jamoncaytaikoramardekharkichunai";
// const COOKIE_EXPIRY: number = 99999999;

// // Add a list of allowed origins.
// // If you have more origins you would like to add, you can add them to the array below.
// const allowedOrigins = [
//   "http://127.0.0.1:3000",
//   "http://localhost:3000",
//   "http://localhost:5173",
//   "https://api.peacetime.xyz",
//   "https://peacetime.xyz",
// ];

// const options: cors.CorsOptions = {
//   //   allowedHeaders: [
//   //     "Origin",
//   //     "X-Requested-With",
//   //     "Content-Type",
//   //     "Accept",
//   //     "X-Access-Token",
//   //   ],
//   credentials: true,
//   methods: ["GET", "HEAD", "OPTIONS", "PUT", "PATCH", "POST", "DELETE"],
//   //   origin: allowedOrigins,
//   exposedHeaders: ["*", "Authorization"],
//   origin: true,
//   preflightContinue: true,
// };

// export const config = {
//   env: process.env,
//   port: SERVER_PORT,
//   corsOptions: options,
//   mongo: {
//     username: MONGO_USERNAME,
//     password: MONGO_PASSWORD,
//     url: MONGO_URL,
//   },
//   server: {
//     port: SERVER_PORT,
//   },
//   jwt: {
//     secret: JWT_SECRET,
//     expire: JWT_EXPIRY,
//   },
//   cookie: {
//     name: COOKIE_NAME,
//     secret: COOKIE_SECRET,
//     expire: COOKIE_EXPIRY,
//   },
// };
