import express from "express";
import { stkPush, mpesaCallbackFix, finishPayment } from "../controllers/mpesaController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/stkpush", stkPush);
router.post("/callback", mpesaCallbackFix);
router.post("/finish-payment", protect, finishPayment);

export default router;