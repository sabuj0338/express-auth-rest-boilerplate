import { Document, Model } from 'mongoose';

export interface IOTP {
  otp: number;
  user: string;
  type: string;
  expires: Date;
  blacklisted: boolean;
}

export type NewOTP = Omit<IOTP, 'blacklisted'>;

export interface IOTPDoc extends IOTP, Document {}

export interface IOTPModel extends Model<IOTPDoc> {}
