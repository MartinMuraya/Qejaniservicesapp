import express from "express";
import {
  getProvidersNearUser,
  getProvidersByService,
  getProviderById
} from "../controllers/providerController.js";

const router = express.Router();

// 🔥 ALWAYS FIRST
router.get("/nearby", getProvidersNearUser);

// Existing routes
router.get("/service/:serviceId", getProvidersByService);
router.get("/:id", getProviderById);

export default router;
