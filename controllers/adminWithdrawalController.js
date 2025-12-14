import Withdrawal from "../models/Withdrawal.js";
import { io } from "../server.js";

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

    // 🔔 Emit real-time dashboard update via Socket.IO
    io.emit("dashboardUpdate", {
      type: "withdrawal",
      withdrawalId: withdrawal._id.toString(),
      amount: withdrawal.amount,
      phone: withdrawal.phone,
      status: withdrawal.status,
    });

    res.json(withdrawal);
  } catch (err) {
    res.status(500).json({ message: "Failed to create withdrawal" });
  }
};
