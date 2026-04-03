import { Router } from "express";
import { getSummary } from "../controllers/dashboardController.js";
import { authorize } from "../middleware/authorize.js";
import { authenticate } from "../middleware/auth.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

router.get("/", authenticate, authorize(ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER), getSummary);

export default router;

