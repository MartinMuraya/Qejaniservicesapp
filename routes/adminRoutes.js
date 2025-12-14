import express from "express";
import {
  getAdminWallet,
  withdrawAdminWallet
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/wallet", getAdminWallet);
router.post("/withdraw", withdrawAdminWallet);

export default router;
