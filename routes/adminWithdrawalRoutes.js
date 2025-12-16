import express from "express";
import { getWithdrawals, createWithdrawal } from "../controllers/adminWithdrawalController.js";
import { adminProtect } from "../middlewares/adminAuthMiddleware.js";

const router = express.Router();

// 🔐 PROTECT THE ROUTES
router.get("/", adminProtect, getWithdrawals);
router.post("/", adminProtect, createWithdrawal);

export default router;
