import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  totalAmount: { type: Number, required: true },
  commission: { type: Number, required: true },
  providerAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  finishedAt: { type: Date },
});

export default mongoose.model('Transaction', transactionSchema);