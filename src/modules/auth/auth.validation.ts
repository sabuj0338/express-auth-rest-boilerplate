import Joi from "joi";
import { password } from "../validate/custom.validation";
import { NewRegisteredUser } from "../user/user.interfaces";

const registerBody: Record<keyof NewRegisteredUser, any> = {
  email: Joi.string().required().email(),
  phone: Joi.string(),
  photo: Joi.string(),
  password: Joi.string().required().custom(password),
  name: Joi.string().required(),
};

export const register = {
  body: Joi.object().keys(registerBody),
};


export const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
  
export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};
  
export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};
  
export const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};
  
export const resetPassword = {
  //   query: Joi.object().keys({
  //     token: Joi.string().required(),
  //   }),
  body: Joi.object().keys({
    otp: Joi.number().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().custom(password),
  }),
};
  
export const verifyEmail = {
  //   query: Joi.object().keys({
  //     // token: Joi.string().required(),
  //   }),
  body: Joi.object().keys({
    otp: Joi.number().required(),
    email: Joi.string().email().required(),
  }),
};
  

// const register = [
//   check("name")
//     .notEmpty()
//     .withMessage("Full name is required")
//     .isLength({ min: 3, max: 25 })
//     .withMessage("Full name must be greater than 3 and less than 25")
//     .trim(),

//   check("email")
//     .notEmpty()
//     .withMessage("Email is required")
//     .isEmail()
//     .trim()
//     .custom((value) => {
//       return User.find({ email: value }).then((doc) => {
//         if (doc.length > 0) {
//           return Promise.reject("Email already exists!");
//         }
//       });
//     }),
//   //   check("phone")
//   //     .notEmpty()
//   //     .withMessage("Mobile number is required")
//   //     .trim()
//   //     .matches("^(?:\\+88|88)?(01[3-9]\\d{8})$")
//   //     .custom((value) => {
//   //       return User.find({ phone: value }).then((doc) => {
//   //         if (doc.length > 0) {
//   //           return Promise.reject("Mobile number already exists!");
//   //         }
//   //       });
//   //     }),
//   check("password")
//     .notEmpty()
//     .withMessage("Password is required")
//     .isLength({ min: 6, max: 20 })
//     .withMessage("Password must be greater than 6 charecter")
//     .trim()
//     .isStrongPassword({
//       minLength: 8,
//       minLowercase: 1,
//       minUppercase: 0,
//       minNumbers: 0,
//       minSymbols: 0,
//       //   returnScore: false,
//       //   pointsPerUnique: 1,
//       //   pointsPerRepeat: 1,
//       //   pointsForContainingLower: 1,
//       //   pointsForContainingUpper: 1,
//       //   pointsForContainingNumber: 1,
//       //   pointsForContainingSymbol: 1,
//     }),
//   //   check("avatar")
//   //     .notEmpty()
//   //     .withMessage("Avatar url is required")
//   //     .isURL()
//   //     .trim(),
// ];

// const login = [
//   //   check("phone")
//   //     .notEmpty()
//   //     .withMessage("Mobile number is required")
//   //     .trim()
//   //     .matches("^(?:\\+88|88)?(01[3-9]\\d{8})$"),
//   check("email")
//     .notEmpty()
//     .withMessage("Email is required")
//     .isEmail()
//     .trim()
//     .custom((value) => {
//       return User.find({ email: value }).then((doc) => {
//         if (doc.length == 0) {
//           return Promise.reject("Invalid email!");
//         }
//       });
//     }),
//   check("password")
//     .notEmpty()
//     .withMessage("Password is required")
//     // .isLength({ min: 6, max: 20 })
//     // .withMessage("Password must be greater than 6 charecter")
//     .trim(),
// ];

// const sendOTP = [
//   //   check("phone")
//   //     .notEmpty()
//   //     .withMessage("Mobile number is required")
//   //     .trim()
//   //     .matches("^(?:\\+88|88)?(01[3-9]\\d{8})$")
//   //     .custom((value) => {
//   //       return User.find({ phone: value }).then((doc) => {
//   //         if (doc.length == 0) {
//   //           return Promise.reject("Invalid request!");
//   //         }
//   //       });
//   //     }),
//   check("email")
//     .notEmpty()
//     .withMessage("Email is required")
//     .isEmail()
//     .trim()
//     .custom((value) => {
//       return User.find({ email: value }).then((doc) => {
//         if (doc.length == 0) {
//           return Promise.reject("Invalid email!");
//         }
//       });
//     }),
// ];

// const otpVerify = [
//   //   check("phone")
//   //     .notEmpty()
//   //     .withMessage("Mobile number is required")
//   //     .trim()
//   //     .matches("^(?:\\+88|88)?(01[3-9]\\d{8})$")
//   //     // .withMessage("Invalid mobile number!")
//   //     .custom((value) => {
//   //       return User.find({ phone: value }).then((doc) => {
//   //         if (doc.length == 0) {
//   //           return Promise.reject("Invalid request!");
//   //         }
//   //       });
//   //     }),
//   check("email")
//     .notEmpty()
//     .withMessage("Email is required")
//     .isEmail()
//     .trim()
//     .custom((value) => {
//       return User.find({ email: value }).then((doc) => {
//         if (doc.length == 0) {
//           return Promise.reject("Invalid email!");
//         }
//       });
//     }),

//   check("otp")
//     .notEmpty()
//     .withMessage("OTP is required")
//     .isNumeric()
//     .withMessage("OTP is invalid"),
// ];

// const profileUpdate = [
//   check("name")
//     .notEmpty()
//     .withMessage("Full name is required")
//     .isLength({ min: 3, max: 25 })
//     .withMessage("Full name must be greater than 3 and less than 25")
//     .trim(),

//   //   check("email")
//   //     // .notEmpty()
//   //     // .withMessage("Email is required")
//   //     .isLength({ max: 250 })
//   //     .withMessage("keywords must be less than 250")
//   //     .isEmail()
//   //     .trim(),

//   check("phone")
//     .notEmpty()
//     .withMessage("Phone is required")
//     .trim()
//     .custom((value, { req }) => {
//       return User.find({ phone: value }).then((doc) => {
//         if (doc.length > 0) {
//           return Promise.reject("Phone already exists!");
//         }
//       });
//     }),
// ];

// const profilePhotoUpdate = [
//   check("photo")
//     .notEmpty()
//     .withMessage("Photo url is required")
//     .isURL()
//     .withMessage("Photo url is invalid")
//     .trim(),
// ];

// const passwordUpdate = [
//   check("phone")
//     .notEmpty()
//     .withMessage("Mobile number is required")
//     .trim()
//     .matches("^(?:\\+88|88)?(01[3-9]\\d{8})$")
//     // .withMessage("Invalid mobile number!")
//     .custom((value) => {
//       return User.find({ phone: value }).then((doc) => {
//         if (doc.length == 0) {
//           return Promise.reject("Invalid request!");
//         }
//       });
//     }),
//   check("otp")
//     .notEmpty()
//     .withMessage("OTP is required")
//     .isNumeric()
//     .withMessage("OTP is invalid"),
//   check("password")
//     .notEmpty()
//     .withMessage("Password url is required")
//     .isLength({ min: 6, max: 20 })
//     .withMessage("Password must be greater than 6 charecter")
//     .trim(),
// ];

// export default {
// //   register,
//   login,
//   sendOTP,
//   otpVerify,
//   profileUpdate,
//   profilePhotoUpdate,
//   passwordUpdate,
// };
