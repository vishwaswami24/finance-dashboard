import mongoose from "mongoose";

export async function connectDatabase(uri) {
  if (!uri) {
    throw new Error("MONGO_URI is not configured.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
}

