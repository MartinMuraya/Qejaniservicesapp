import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', unique: true },
  balance: { type: Number, default: 0 },   // withdrawable
  pending: { type: Number, default: 0 },   // pending completion
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Wallet', walletSchema);