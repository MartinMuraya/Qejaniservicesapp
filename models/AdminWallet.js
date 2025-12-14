// models/AdminWallet.js
import mongoose from "mongoose";

const adminWalletSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("AdminWallet", adminWalletSchema);
