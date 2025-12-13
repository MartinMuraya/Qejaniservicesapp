// routes/orderRoutes.js
import express from "express";
import { createOrder, getUserOrders } from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST create a booking/order
router.post("/", protect, createOrder);

// GET orders for current user
router.get("/user", protect, getUserOrders);

export default router;
