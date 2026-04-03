import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { USER_STATUSES } from "../utils/constants.js";
import { validateLoginPayload } from "../utils/validation.js";

function createToken(user) {
  return jwt.sign(
    {
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      subject: user._id.toString(),
      expiresIn: "8h"
    }
  );
}

export const login = asyncHandler(async (req, res) => {
  const { errors, value } = validateLoginPayload(req.body);

  if (errors.length > 0) {
    throw new AppError(400, "Login validation failed.", errors);
  }

  const user = await User.findOne({ email: value.email }).select("+passwordHash");

  if (!user) {
    throw new AppError(401, "Invalid email or password.");
  }

  if (user.status !== USER_STATUSES.ACTIVE) {
    throw new AppError(403, "This account is inactive. Contact an administrator.");
  }

  const passwordMatches = await user.comparePassword(value.password);

  if (!passwordMatches) {
    throw new AppError(401, "Invalid email or password.");
  }

  user.lastLogin = new Date();
  await user.save();

  res.json({
    message: "Login successful.",
    token: createToken(user),
    user: user.toSafeObject()
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    user: req.user.toSafeObject()
  });
});
