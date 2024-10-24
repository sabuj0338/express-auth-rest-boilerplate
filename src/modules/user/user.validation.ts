import Joi from "joi";
import { password, objectId } from "../validate/custom.validation";
import { NewCreatedUser } from "./user.interfaces";

const createUserBody: Record<keyof NewCreatedUser, any> = {
  email: Joi.string().required().email(),
  phone: Joi.string(),
  photo: Joi.string(),
  password: Joi.string().required().custom(password),
  name: Joi.string().required(),
  roles: Joi.string().required().valid("customer", "admin"),
};

export const createUser = {
  body: Joi.object().keys(createUserBody),
};

export const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    phone: Joi.string(),
    photo: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      phone: Joi.string(),
      photo: Joi.string(),
    })
    .min(1),
};

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
