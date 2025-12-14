import express from "express";
import { getWithdrawals, createWithdrawal } from "../controllers/adminWithdrawalController.js";

const router = express.Router();

// Get all withdrawals
router.get("/", getWithdrawals);

// Optional: manually create a withdrawal
router.post("/", createWithdrawal);

export default router;
