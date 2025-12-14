import AdminWallet from "../models/AdminWallet.js";
import Withdrawal from "../models/Withdrawal.js"; // optional for now

// GET ADMIN WALLET BALANCE
export const getAdminWallet = async (req, res) => {
  try {
    let wallet = await AdminWallet.findOne();
    if (!wallet) {
      wallet = await AdminWallet.create({ balance: 0 });
    }
    res.json({ balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admin wallet" });
  }
};

// MANUAL WITHDRAW (no B2C yet)
export const withdrawAdminWallet = async (req, res) => {
  try {
    const wallet = await AdminWallet.findOne();
    if (!wallet || wallet.balance < 200) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const amount = wallet.balance;

    // 🔴 LATER: call M-Pesa B2C here
    wallet.balance = 0;
    await wallet.save();

    res.json({
      success: true,
      message: "Withdrawal successful",
      amount
    });

  } catch (err) {
    res.status(500).json({ message: "Withdrawal failed" });
  }
};
