// routes/orderRoutes.js
import express from "express";
import { createOrder, getUserOrders } from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST create a booking/order
router.post("/", authMiddleware, createOrder);

// GET orders for current user
router.get("/user", authMiddleware, getUserOrders);

export default router;
