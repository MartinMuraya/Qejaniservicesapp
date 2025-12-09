import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    required: true
  },
  amount: Number,
  commission: Number,
  providerAmount: Number,
  phone: String,
  mpesaReceipt: String,
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
