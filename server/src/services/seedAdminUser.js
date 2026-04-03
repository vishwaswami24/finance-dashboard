import { User } from "../models/User.js";
import { ROLES, USER_STATUSES } from "../utils/constants.js";

export async function seedAdminUser() {
  const userCount = await User.countDocuments();

  if (userCount > 0) {
    return null;
  }

  const admin = await User.create({
    name: process.env.SEED_ADMIN_NAME || "System Admin",
    email: (process.env.SEED_ADMIN_EMAIL || "admin@financehub.local").toLowerCase(),
    passwordHash: process.env.SEED_ADMIN_PASSWORD || "Admin@123",
    role: ROLES.ADMIN,
    status: USER_STATUSES.ACTIVE
  });

  return admin.toSafeObject();
}

