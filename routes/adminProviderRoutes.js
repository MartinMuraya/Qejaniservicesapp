import express from "express";
import {
  getProviders,
  createProvider,
  updateProvider,
  deleteProvider,
} from "../controllers/adminProviderController.js";
import providerUpload from "../middlewares/providerUpload.js";
import { adminProtect } from "../middlewares/adminAuthMiddleware.js";

const router = express.Router();

// 🔐 Protect all routes
router.use(adminProtect);

// GET all providers
router.get("/", getProviders);

// CREATE provider (image upload + geo location)
router.post("/", providerUpload.single("image"), createProvider);

// UPDATE provider (optional image upload)
router.put("/:id", providerUpload.single("image"), updateProvider);

// DELETE provider
router.delete("/:id", deleteProvider);

export default router;
