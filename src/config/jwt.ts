import status from "http-status";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { IPayload, tokenType } from "../models/token.model";
import User from "../models/user.model";
import ApiError from "../utils/ApiError";
import env from "./env";

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: env.jwt.secret || "secret",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: IPayload, done) => {
    try {
      if (payload.type !== tokenType.ACCESS) {
        throw new ApiError(status.BAD_REQUEST, "Invalid token type");
      }
      const user = await User.findById(payload.sub);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

export default jwtStrategy;
