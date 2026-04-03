import { AppError } from "../utils/AppError.js";

export function authorize(...roles) {
  return function roleGuard(req, _res, next) {
    if (!req.user) {
      next(new AppError(401, "Authentication is required."));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError(403, "You do not have permission to perform this action."));
      return;
    }

    next();
  };
}

