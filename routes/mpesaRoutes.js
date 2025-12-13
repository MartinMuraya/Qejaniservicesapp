import express from "express";
import { stkPush, mpesaCallbackFix } from "../controllers/mpesaController.js";
const router = express.Router();

router.post("/stkpush", stkPush);
router.post("/callback", mpesaCallbackFix);

export default router;