import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from '../enums/role.enums';

export const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    roles: {
      type: [String],
      enum: [Role.ADMIN, Role.USER],
      default: [Role.USER],
    },
    refreshToken: String,
    refreshTokenExp: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  next();
});
