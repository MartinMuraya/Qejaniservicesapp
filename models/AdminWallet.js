import mongoose from 'mongoose';

const adminWalletSchema = new mongoose.Schema({
  totalCommission: { type: Number, default: 0 }, // total earnings from commissions
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }], // track all transactions
}, { timestamps: true }); // createdAt and updatedAt

export default mongoose.model('AdminWallet', adminWalletSchema);
