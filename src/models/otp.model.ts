import mongoose, { Document, Model } from "mongoose";
import { toJSON } from "../utils/toJson";

export const otpType = {
  ACCESS: "ACCESS",
  REFRESH: "REFRESH",
  RESET_PASSWORD: "RESET_PASSWORD",
  VERIFY_EMAIL: "VERIFY_EMAIL",
};

export interface IOtp {
  otp: number;
  user: string;
  type: string;
  expires: Date;
  blacklisted: boolean;
}

export type CreateOtp = Omit<IOtp, "blacklisted">;

export interface IOtpDoc extends IOtp, Document {}

export interface IOtpModel extends Model<IOtpDoc> {}

const otpSchema = new mongoose.Schema<IOtpDoc, IOtpModel>(
  {
    otp: {
      type: Number,
      required: true,
      index: true,
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [otpType.REFRESH, otpType.RESET_PASSWORD, otpType.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
otpSchema.plugin(toJSON);

const Otp = mongoose.model<IOtpDoc, IOtpModel>("Otp", otpSchema);

export default Otp;
