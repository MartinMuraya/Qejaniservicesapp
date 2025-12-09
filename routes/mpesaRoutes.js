import express from "express";
import { stkPush, stkCallback } from "../controllers/mpesaController.js";

const router = express.Router();

router.post("/stkpush", stkPush);
router.post("/callback", stkCallback);

export default router;