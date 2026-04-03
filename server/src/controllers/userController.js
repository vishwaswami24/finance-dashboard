import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateUserPayload } from "../utils/validation.js";

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.json({
    users: users.map((user) => user.toSafeObject())
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  res.json({
    user: user.toSafeObject()
  });
});

export const createUser = asyncHandler(async (req, res) => {
  const { errors, value } = validateUserPayload(req.body);

  if (errors.length > 0) {
    throw new AppError(400, "User validation failed.", errors);
  }

  const user = await User.create({
    name: value.name,
    email: value.email,
    passwordHash: value.password,
    role: value.role,
    status: value.status
  });

  res.status(201).json({
    message: "User created successfully.",
    user: user.toSafeObject()
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { errors, value } = validateUserPayload(req.body, { partial: true });

  if (errors.length > 0) {
    throw new AppError(400, "User validation failed.", errors);
  }

  const user = await User.findById(req.params.id).select("+passwordHash");

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  if (value.name !== undefined) {
    user.name = value.name;
  }

  if (value.email !== undefined) {
    user.email = value.email;
  }

  if (value.password !== undefined) {
    user.passwordHash = value.password;
  }

  if (value.role !== undefined) {
    user.role = value.role;
  }

  if (value.status !== undefined) {
    user.status = value.status;
  }

  await user.save();

  res.json({
    message: "User updated successfully.",
    user: user.toSafeObject()
  });
});

