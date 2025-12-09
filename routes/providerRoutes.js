// routes/providerRoutes.js
import express from "express";
import { getProvidersByService } from "../controllers/providerController.js";

const router = express.Router();

// GET providers offering a specific service
router.get("/service/:serviceId", getProvidersByService);

export default router;
