import { AppError } from "../utils/AppError.js";

export function notFound(req, _res, next) {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error, _req, res, _next) {
  if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyPattern ?? {})[0] ?? "field";
    res.status(409).json({
      message: "A record with that value already exists.",
      details: [{ field: duplicateField, message: `${duplicateField} must be unique.` }]
    });
    return;
  }

  if (error.name === "ValidationError") {
    const details = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message
    }));

    res.status(400).json({
      message: "Validation failed.",
      details
    });
    return;
  }

  if (error.name === "CastError") {
    res.status(400).json({
      message: "Invalid resource identifier.",
      details: [{ field: error.path, message: `${error.path} is not a valid identifier.` }]
    });
    return;
  }

  const statusCode = error instanceof AppError ? error.statusCode : 500;
  res.status(statusCode).json({
    message: error.message || "An unexpected server error occurred.",
    details: error.details
  });
}
