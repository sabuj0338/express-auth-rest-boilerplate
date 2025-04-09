import status from "http-status";
import User, {
  CreateNewUser,
  IUserDoc,
  UpdateUser
} from "../models/user.model";
import ApiError from "../utils/ApiError";
import { IOptions, QueryResult } from "../utils/pagination";

export const createUser = async (
  userBody: CreateNewUser
): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(status.BAD_REQUEST, "User already exists");
  }
  return User.create(userBody);
};

export const queryUsers = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult> => {
  const users = await User.paginate(filter, options);
  return users;
};

export const getUserById = async (id: string): Promise<IUserDoc | null> =>
  User.findById(id);

export const getUserByEmail = async (email: string): Promise<IUserDoc | null> =>
  User.findOne({ email });

export const updateUserById = async (
  userId: string,
  updateBody: UpdateUser
): Promise<IUserDoc | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(status.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

export const deleteUserById = async (
  userId: string
): Promise<IUserDoc | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  await user.deleteOne();
  return user;
};
