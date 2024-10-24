
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import httpStatus from "http-status";
import ApiError from "../errors/ApiError";
import Role from "../../config/roles";
import { IUserDoc } from "../user/user.interfaces";

// import { Request, Response, NextFunction } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import config from "../../config/config";
// import { IUserDoc } from "../user/user.interfaces";

const verifyCallback =
  (req: Request, resolve: any, reject: any, requiredRoles: string[], isVerified: boolean) =>
    async (err: Error, user: IUserDoc, info: string) => {
      if (err || info || !user) {
        // return reject(new Error("Please authenticate"));
        return reject(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
      }
      req.user = user;

      if (isVerified === false) {
        return reject(new ApiError(httpStatus.FORBIDDEN, "User not verified!"));
      }

      if (requiredRoles.length) {
        const userRights = Role.all.some((r) => user.roles.indexOf(r) >= 0);
        // const userRights = roleRights.get(user.roles);
        if (!userRights) return reject(new ApiError(httpStatus.FORBIDDEN, "Unauthorized user!"));

        // const hasRequiredRights = requiredRoles.every((requiredRight: string) => userRights.includes(requiredRight));
        // if (!hasRequiredRights && req.params.userId !== user.id) {
        //   return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
        // }
      }

      resolve();
    };

const authMiddleware =
  (roles: string[], isVerified = true) =>
    async (req: Request, res: Response, next: NextFunction) =>
      new Promise<void>((resolve, reject) => {
        passport.authenticate("jwt", { session: false }, verifyCallback(req, resolve, reject, roles, isVerified))(req, res, next);
      })
        .then(() => next())
        .catch((err) => next(err));

export default authMiddleware;

// interface DataStoredInToken extends JwtPayload, IUserDoc {}

// export default function auth(roles: string[], isVerified = true) {
//   return async function (req: Request, res: Response, next: NextFunction) {
//     try {
//       // console.log(JSON.stringify(req.headers));
//       const token = req.header("Authorization")?.replace("Bearer ", "");

//       if (token) {
//         // token = cookies[process.env.COOKIE_NAME];
//         const decoded = jwt.verify(
//           token,
//           config.jwt.secret,
//         ) as DataStoredInToken;
//         // console.log("decoded", decoded);
//         // const auth: UserInterface
//         // const user = await UserModel.findOne({ deviceId: decoded.deviceId });
//         if (decoded === null || !decoded.roles.some((r) => roles.indexOf(r) >= 0)) {
//           throw Error("Unauthorized User!");
//         }
//         req.user = {
//           _id: decoded._id,
//           //   deviceId: user.deviceId,
//           name: decoded.name || "",
//           //packageName: decoded.packageName,
//           email: decoded.email || "",
//           phone: decoded.phone || "",
//           //   country: user.country || "",
//           photo: decoded.photo || "",
//           //   totalGold: user.totalGold || 0,
//           isEmailVerified: decoded.isVerified,
//           isPhoneVerified: decoded.isVerified,
//           lastLogin: decoded.lastLogin,
//           roles: decoded.roles,
//           status: decoded.status,
//         } as IUserDoc;

//         next();
//       } else {
//         throw Error("Unauthorized Attempt!");
//       }
//     } catch (e) {
//       return res.status(403).json({ message: (e as Error).message });
//     }
//   };
// }
