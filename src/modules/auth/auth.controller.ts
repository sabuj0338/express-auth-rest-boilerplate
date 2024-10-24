import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { tokenService } from "../token";
import { otpService } from "../otp";
import { userService } from "../user";
import * as authService from "./auth.service";
import { emailService } from "../email";

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.registerUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});
  
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});
  
export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});
  
export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...userWithTokens });
});
  
export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  //   const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  //   await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  const resetPasswordOTP = await otpService.generateResetPasswordOTP(req.body.email);
  await emailService.sendResetPasswordEmailByOTP(req.body.email, resetPasswordOTP);
  res.status(httpStatus.NO_CONTENT).send();
});
  
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  //   await authService.resetPassword(req.query['token'], req.body.password);
  const user = await userService.getUserByEmail(req.body.email);
  if (!user) throw new Error();
  
  await authService.resetPasswordByOTP(req.body.otp, user.id, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});
  
export const sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
  //   const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  //   await emailService.sendVerificationEmail(req.user.email, verifyEmailToken, req.user.name);
  const verifyEmailOTP = await otpService.generateVerifyEmailOTP(req.user);
  await emailService.sendVerificationEmailByOTP(req.user.email, verifyEmailOTP, req.user.name);
  res.status(httpStatus.NO_CONTENT).send();
});
  
export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  //   await authService.verifyEmail(req.query['token']);
  const user = await userService.getUserByEmail(req.body.email);
  if (!user) throw new Error();
  await authService.verifyEmailByOTP(req.body.otp, user.id);
  res.status(httpStatus.NO_CONTENT).send();
});
  
// import { Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// import config from "../../config/config";
// import { UserModel } from "../user";
// import { IUser } from "../user/user.interfaces";


// async function sendOTP(req: Request, res: Response) {
//   try {
//     const now = new Date();
//     const otpExpired = now.setMinutes(now.getMinutes() + 5);
//     let result = await UserModel.findOneAndUpdate(
//       { phone: req.body.phone },
//       { otp: 123456, otpExpired: otpExpired },
//       {
//         new: true,
//       },
//     );
//     return res.status(200).json({
//       message: "OTP sent successfull",
//       data: result,
//     });

//   } catch (e) {
//     return res.status(500).json({ message: (e as Error).message });
//   }
// }

// // handle login functionality
// async function verifyOTP(req: Request, res: Response) {
//   try {
//     // const { auth } = req;
//     const { otp, phone } = req.body;
//     // if (
//     //   auth == null ||
//     //   auth == undefined ||
//     //   auth.phone == null ||
//     //   auth.phone == undefined
//     // ) {
//     //   throw new Error("Invalid request!");
//     // }
//     const userDoc = await UserModel.findOne({
//       phone: phone,
//       status: "active",
//     });

//     if (userDoc && userDoc._id && userDoc.otp === otp) {
//       // let result = await UserModel.updateOne(req.body);
//       // const now = new Date();
//       // const otpExpired = now.setMinutes(now.getMinutes() + 5);
//       let result = await UserModel.findOneAndUpdate(
//         { phone: phone },
//         { isVerified: true },
//         {
//           new: true,
//         },
//       );

//       return res.status(200).json({
//         message: "OTP virfied",
//         data: result,
//       });
//     }

//     throw new Error("Invalid request!");
//   } catch (e) {
//     return res.status(500).json({ message: (e as Error).message });
//   }
// }

// // handle profile data of loggedIn user
// async function update(req: Request, res: Response) {
//   // const custom: CustomRequest = req;
//   // console.log("profile controller", req.auth);
//   try {
//     const authUser = req.user;
//     if (
//       authUser == null ||
//       authUser == undefined ||
//       authUser.phone == null ||
//       authUser.phone == undefined
//     ) {
//       throw new Error("User not found!");
//     }

//     const updateData: IUser = {
//       name: req.body.name,
//       email: req.body.email,
//       //   phone: req.body.phone,
//     } as IUser;
//     // console.log(updateData);
//     // let result = await UserModel.updateOne(req.body);
//     let result = await UserModel.findOneAndUpdate(
//       { phone: authUser.phone },
//       updateData,
//       {
//         new: true,
//       },
//     );

//     // await new NotificationModel({
//     //   userId: authUser._id,
//     //   message: "Profile information updated!",
//     // }).save();

//     return res.status(200).json({
//       message: "success",
//       data: result,
//     });
//   } catch (e) {
//     return res.status(500).json({ message: (e as Error).message });
//   }
// }

// async function updatePhoto(req: Request, res: Response) {
//   // const custom: CustomRequest = req;
//   // console.log("profile controller", req.auth);
//   try {
//     const { user: authUser } = req;
//     if (
//       authUser == null ||
//       authUser == undefined ||
//       authUser.phone == null ||
//       authUser.phone == undefined
//     ) {
//       throw new Error("Request failed!");
//     }

//     let result = await UserModel.findOneAndUpdate(
//       { phone: authUser.phone },
//       { photo: req.body.photo },
//       {
//         new: true,
//       },
//     );

//     // await new NotificationModel({
//     //   userId: authUser._id,
//     //   message: "Profile photo updated!",
//     // }).save();

//     return res.status(200).json({
//       message: "success",
//       data: result,
//     });
//   } catch (e) {
//     return res.status(500).json({ message: (e as Error).message });
//   }
// }

// async function updatePassword(req: Request, res: Response) {
//   // const custom: CustomRequest = req;
//   // console.log("profile controller", req.auth);
//   try {
//     // const { auth: authUser } = req;
//     // if (
//     //   authUser == null ||
//     //   authUser == undefined ||
//     //   authUser.phone == null ||
//     //   authUser.phone == undefined
//     // ) {
//     //   throw new Error("Request failed!");
//     // }
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     let result = await UserModel.findOneAndUpdate(
//       { phone: req.body.phone, otp: req.body.otp },
//       { password: hashedPassword, otp: null, otpExpired: null },
//       {
//         new: true,
//       },
//     );

//     // if (!result?.$isEmpty) {
//     //   await new NotificationModel({
//     //     userId: result?._id,
//     //     message: "Password updated!",
//     //   }).save();
//     // }

//     return res.status(200).json({
//       message: "success",
//       data: result,
//     });
//   } catch (e) {
//     return res.status(500).json({ message: (e as Error).message });
//   }
// }

// async function register(req: Request, res: Response) {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);

//     let newDoc = new UserModel({
//       ...req.body,
//       password: hashedPassword,
//     });

//     const result = await newDoc.save();

//     return res.status(200).json({
//       message: "Registration successfull!",
//       user: result,
//     });
//   } catch (e) {
//     return res.status(500).json({ message: (e as Error).message });
//   }
// }

// // handle login functionality
// async function login(req: Request, res: Response) {
//   // return res.json({ message: 'profile controller' });
//   const { email, password } = req.body;

//   try {
//     const userDoc = await UserModel.findOne({ email: email, status: "active" });
//     if (userDoc && userDoc._id) {
//       const isValidPassword = await bcrypt.compare(
//         password,
//         userDoc.password,
//       );
//       if (isValidPassword) {
//         let userDocObject = {
//           _id: userDoc._id,
//           // deviceId: userDoc.deviceId,
//           name: userDoc.name || "",
//           email: userDoc.email || "",
//           phone: userDoc.phone || "",
//           // country: userDoc.country || '',
//           photo: userDoc.photo || "",
//           // gameProfiles: userDoc.gameProfiles || [],
//           isEmailVerified: userDoc.isEmailVerified,
//           isPhoneVerified: userDoc.isPhoneVerified,
//           lastLogin: userDoc.lastLogin,
//           roles: userDoc.roles,
//           status: userDoc.status,
//           // totalGold: totalGold,
//         };

//         // generate token
//         const token = jwt.sign(userDocObject, config.jwt.secret, {
//           expiresIn: 60 * config.jwt.accessExpirationMinutes,
//         });

//         // set cookie
//         const date = new Date();
//         date.setHours(date.getHours() + 5);
//         // res.setHeader('Set-Cookie', 'isLoggedin=true');
//         res.cookie(config.cookie.name, token, {
//           maxAge: config.cookie.expire,
//           secure: true,
//           httpOnly: true,
//           signed: true,
//           expires: date,
//           sameSite: "none",
//           domain: "peacetime.xyz",
//           path: "/",
//         });

//         // set logged in user local identifier
//         res.locals.loggedInUser = userDocObject;

//         return res.status(200).json({
//           message: "Login successfull",
//           data: { token, user: userDocObject },
//         });
//       }
//       return res.status(400).json({ message: "Login failed! Invalid password!" });
//     }
//     throw new Error("Login failed!");
//   } catch (e) {
//     return res.status(500).json({ message: (e as Error).message });
//   }
// }

// // handle login functionality
// async function logout(req: Request, res: Response) {
//   try {
//     res.clearCookie(config.cookie.name);
//     return res.status(200).json({ message: "Logout success!" });
//   } catch (e) {
//     return res.status(500).json({ message: (e as Error).message });
//     // return res.status(500).json(e);
//   }
// }

// // handle profile data of loggedIn user
// async function profile(req: Request, res: Response) {
//   // const custom: CustomRequest = req;
//   // console.log("profile controller", req.auth);
//   try {
//     const { user } = req;
//     // if (authUser == null || authUser == undefined || authUser.deviceId == null || authUser.deviceId == undefined) {
//     //   return res.status(404).json({ message: 'User not found!' });
//     // }

//     // const data = await getAuth(authUser);

//     // if (data == null) {
//     //   return res.status(404).json({ message: 'User not found!' });
//     // }
//     return res.status(200).json({
//       message: "success",
//       data: { user },
//     });
//   } catch (e) {
//     return res.status(500).json({ message: (e as Error).message });
//   }
// }

// export default { register, login, logout, profile, sendOTP, verifyOTP, update, updatePassword, updatePhoto };