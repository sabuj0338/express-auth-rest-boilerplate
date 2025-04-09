import { IPayload } from "./models/token.model";

declare module "express-serve-static-core" {
  export interface Request {
    auth: IPayload;
  }
}