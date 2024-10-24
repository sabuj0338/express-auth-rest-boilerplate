import mongoose from 'mongoose';
import otpTypes from './otp.types';
import toJSON from '../toJSON/toJSON';
import { IOTPDoc, IOTPModel } from './otp.interfaces';

const otpSchema = new mongoose.Schema<IOTPDoc, IOTPModel>(
  {
    otp: {
      type: Number,
      required: true,
      index: true,
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [otpTypes.REFRESH, otpTypes.RESET_PASSWORD, otpTypes.VERIFY_EMAIL],
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

const OTP = mongoose.model<IOTPDoc, IOTPModel>('OTP', otpSchema);

export default OTP;
