import Withdrawal from "../models/Withdrawal.js";

// GET all withdrawals (latest first)
export const getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find().sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch withdrawals" });
  }
};

// OPTIONAL: create withdrawal (manual trigger)
export const createWithdrawal = async (req, res) => {
  try {
    const { amount, phone, status } = req.body;

    const withdrawal = await Withdrawal.create({
      amount,
      phone,
      status: status || "success"
    });

    res.json(withdrawal);
  } catch (err) {
    res.status(500).json({ message: "Failed to create withdrawal" });
  }
};
