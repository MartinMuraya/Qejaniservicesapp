import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema({
  amount: Number,
  phone: String,
  status: {
    type: String,
    enum: ["success", "failed"],
    default: "success"
  }
}, { timestamps: true });

export default mongoose.model("Withdrawal", withdrawalSchema);
