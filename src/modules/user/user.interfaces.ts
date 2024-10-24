import mongoose, { Model, Document } from "mongoose";
import { QueryResult } from "../paginate/paginate";
import { AccessAndRefreshTokens } from "../token/token.interfaces";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  photo: string;
  password: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin: Date;
  roles: Array<string>;
  status: string; //['active', 'disabled', 'blocked']
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}
  
export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
  
export type UpdateUserBody = Partial<IUser>;
  
export type NewRegisteredUser = Omit<IUser, "roles" | "isEmailVerified" | "isPhoneVerified" | "lastLogin" | "status">;
  
export type NewCreatedUser = Omit<IUser, "isEmailVerified" | "isPhoneVerified" | "lastLogin" | "status">;
  
export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}