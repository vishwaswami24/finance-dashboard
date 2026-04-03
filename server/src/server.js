import dotenv from "dotenv";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { seedAdminUser } from "./services/seedAdminUser.js";

dotenv.config();

const port = Number.parseInt(process.env.PORT || "5000", 10);

async function startServer() {
  await connectDatabase(process.env.MONGO_URI);
  const seededAdmin = await seedAdminUser();

  if (seededAdmin) {
    console.log(`Seeded admin user: ${seededAdmin.email}`);
  }

  app.listen(port, () => {
    console.log(`Finance dashboard API listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
