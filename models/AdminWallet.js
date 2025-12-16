import mongoose from 'mongoose';

const adminWalletSchema = new mongoose.Schema({
  totalCommission: { type: Number, default: 0 },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('AdminWallet', adminWalletSchema);
