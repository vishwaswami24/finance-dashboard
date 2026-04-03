import { Router } from "express";
import { createUser, getUserById, listUsers, updateUser } from "../controllers/userController.js";
import { authorize } from "../middleware/authorize.js";
import { authenticate } from "../middleware/auth.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.route("/").get(listUsers).post(createUser);
router.route("/:id").get(getUserById).patch(updateUser);

export default router;

