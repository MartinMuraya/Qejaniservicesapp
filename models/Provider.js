// models/Provider.js
import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true }, // ✅ ObjectId with ref
  phone: { type: String, required: true },
  price: { type: Number, required: true },
  walletBalance: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Provider", providerSchema);
