import bcrypt from "bcryptjs";
import status from "http-status";
import mongoose, { Document, Model } from "mongoose";
import validator from "validator";
import ApiError from "../utils/ApiError";
import { paginate, QueryResult } from "../utils/pagination";
import { toJSON } from "../utils/toJson";
import { AccessAndRefreshTokens } from "./token.model";

const allRoles = {
  customer: [],
  superAdmin: [],
  admin: ["getUsers", "manageUsers"],
  seller: [],
  moderator: [],
  deliveryMan: [],
};

export class Role {
  static all = Object.keys(allRoles);

  static onlyAdmins = ["superAdmin", "admin"];
}

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(
  Object.entries(allRoles)
);

export interface IUser {
  fullName: string;
  username: string;
  avatar: string;
  phone: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  lastLogin: Date;
  roles: Array<string>;
  status: string; //['active', 'disabled', 'blocked']
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}

export type UpdateUser = Partial<IUser>;

export type RegisterNewUser = Omit<
  IUser,
  "roles" | "isEmailVerified" | "lastLogin" | "status"
>;

export type CreateNewUser = Omit<
  IUser,
  "isEmailVerified" | "lastLogin" | "status"
>;

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}

const userSchema = new mongoose.Schema<IUserDoc, IUserModel>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new ApiError(status.BAD_REQUEST, "Invalid email");
        }
      },
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    avatar: {
      type: String,
      required: false,
      validate(value: string) {
        if (!validator.isURL(value)) {
          throw new ApiError(status.BAD_REQUEST, "Invalid image url");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new ApiError(status.BAD_REQUEST, 
            "Password must contain at least one letter and one number"
          );
        }
      },
      private: true, // used by the toJSON plugin
    },
    roles: {
      type: [String],
      enum: roles,
      default: ["customer"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static(
  "isEmailTaken",
  async function (
    email: string,
    excludeUserId: mongoose.ObjectId
  ): Promise<boolean> {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  }
);

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method(
  "isPasswordMatch",
  async function (password: string): Promise<boolean> {
    const user = this;
    return bcrypt.compare(password, user.password);
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model<IUserDoc, IUserModel>("User", userSchema);

export default User;
