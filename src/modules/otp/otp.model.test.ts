import moment from 'moment';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import config from '../../config/config';
import { NewOTP } from './otp.interfaces';
import otpTypes from './otp.types';
import OTP from './otp.model';
import * as otpService from './otp.service';

const password = 'password1';

const userOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const userOneAccessOTP = otpService.generateOTP();

describe('OTP Model', () => {
  const refreshOTPExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  let newOTP: NewOTP;
  beforeEach(() => {
    newOTP = {
      otp: userOneAccessOTP,
      user: userOne._id.toHexString(),
      type: otpTypes.REFRESH,
      expires: refreshOTPExpires.toDate(),
    };
  });

  test('should correctly validate a valid otp', async () => {
    await expect(new OTP(newOTP).validate()).resolves.toBeUndefined();
  });

  test('should throw a validation error if type is unknown', async () => {
    newOTP.type = 'invalidType';
    await expect(new OTP(newOTP).validate()).rejects.toThrow();
  });
});
