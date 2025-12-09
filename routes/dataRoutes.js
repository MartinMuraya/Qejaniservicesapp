import express from "express";
import {
  getProviderPayments,
  getAdminEarnings,
} from "../controllers/dataController.js";

const router = express.Router();

// Get payments for a specific provider
router.get("/payments/provider/:id", getProviderPayments);

// Get all admin earnings
router.get("/adminEarnings", getAdminEarnings);

export default router;
