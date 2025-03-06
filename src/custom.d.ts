import { IUserDoc } from "./models/user.model";

declare module "express-serve-static-core" {
  export interface Request {
    user: IUserDoc;
  }
}