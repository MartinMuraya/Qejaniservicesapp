import AdminWallet from "../models/AdminWallet.js";
import Withdrawal from "../models/Withdrawal.js";
import Provider from "../models/Provider.js";
import Payment from "../models/Payment.js";

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

    // Optionally create a withdrawal record
    await Withdrawal.create({
      amount,
      phone: req.body.phone,
      status: "pending",
    });

    res.json({
      success: true,
      message: "Withdrawal successful",
      amount,
    });
  } catch (err) {
    res.status(500).json({ message: "Withdrawal failed" });
  }
};

// GET ALL PROVIDERS
export const getAdminProviders = async (req, res) => {
  try {
    const providers = await Provider.find().populate("service");
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch providers" });
  }
};

// GET ALL ADMIN EARNINGS
export const getAdminEarnings = async (req, res) => {
  try {
    const earnings = await Payment.find().populate("providerId");
    res.json(earnings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch earnings" });
  }
};

// GET ALL WITHDRAWALS
export const getAdminWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find();
    res.json(withdrawals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch withdrawals" });
  }
};
