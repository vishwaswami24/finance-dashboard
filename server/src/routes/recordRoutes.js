import { Router } from "express";
import {
  createRecord,
  deleteRecord,
  getRecordById,
  listRecords,
  updateRecord
} from "../controllers/recordController.js";
import { authorize } from "../middleware/authorize.js";
import { authenticate } from "../middleware/auth.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize(ROLES.ADMIN, ROLES.ANALYST), listRecords);
router.get("/:id", authorize(ROLES.ADMIN, ROLES.ANALYST), getRecordById);
router.post("/", authorize(ROLES.ADMIN), createRecord);
router.patch("/:id", authorize(ROLES.ADMIN), updateRecord);
router.delete("/:id", authorize(ROLES.ADMIN), deleteRecord);

export default router;

