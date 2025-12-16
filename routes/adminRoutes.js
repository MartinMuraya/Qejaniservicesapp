import express from "express";
import {
  getAdminWallet,
  withdrawAdminWallet,
  getAdminProviders,
  getAdminEarnings,
  getAdminWithdrawals,
} from "../controllers/adminController.js";

const router = express.Router();

// Wallet
router.get("/wallet", getAdminWallet);
router.post("/withdraw", withdrawAdminWallet);

// Providers
router.get("/providers", getAdminProviders);

// Earnings / Payments
router.get("/earnings", getAdminEarnings);

// Withdrawals
router.get("/withdrawals", getAdminWithdrawals);

export default router;
