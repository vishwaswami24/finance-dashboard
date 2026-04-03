import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { USER_STATUSES } from "../utils/constants.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError(401, "Authentication token is required.");
  }

  const token = header.replace("Bearer ", "").trim();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);

    if (!user || user.status !== USER_STATUSES.ACTIVE) {
      throw new AppError(401, "This account is no longer available.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(401, "Authentication token is invalid or expired.");
  }
});

