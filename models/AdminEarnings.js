import mongoose from "mongoose";

const adminEarningsSchema = new mongoose.Schema({
  amount: Number,
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider"
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment"
  }
}, { timestamps: true });

export default mongoose.model("AdminEarnings", adminEarningsSchema);
