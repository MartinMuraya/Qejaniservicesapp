// routes/serviceRoutes.js
import express from "express";
import { getServices } from "../controllers/serviceController.js";

const router = express.Router();

// GET all services
router.get("/", getServices);

export default router;
