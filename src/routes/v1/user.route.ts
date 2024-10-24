import express, { Router } from "express";
import Role from "../../config/roles";
import { auth } from "../../modules/auth";
import { userController, userValidation } from "../../modules/user";
import { validate } from "../../modules/validate";

const router: Router = express.Router();

router
  .route("/")
  .post(auth(Role.onlyAdmins), validate(userValidation.createUser), userController.createUser)
  .get(auth(Role.onlyAdmins), validate(userValidation.getUsers), userController.getUsers);

router
  .route("/:userId")
  .get(auth(Role.onlyAdmins), validate(userValidation.getUser), userController.getUser)
  .patch(auth(Role.onlyAdmins), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(Role.onlyAdmins), validate(userValidation.deleteUser), userController.deleteUser);

export default router;
