import express from "express";
import {
  getProvidersByService,
  getProviderById
} from "../controllers/providerController.js";

const router = express.Router();

router.get("/service/:serviceId", getProvidersByService);
router.get("/:id", getProviderById); // ✅ ADD THIS

export default router;
