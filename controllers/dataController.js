import Payment from "../models/Payment.js";
import AdminEarnings from "../models/AdminEarnings.js";
import Provider from "../models/Provider.js";
import mongoose from "mongoose";

// Get all payments for a provider and wallet balance

export const getProviderPayments = async (req, res) => {
  try {
    const providerId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(providerId)) {
      return res.status(400).json({ message: "Invalid provider ID" });
    }

    // Fetch payments
    const payments = await Payment.find({ providerId: mongoose.Types.ObjectId(providerId) })
      .sort({ createdAt: -1 });

    // Get wallet balance
    const provider = await Provider.findById(providerId);
    const walletBalance = provider?.walletBalance || 0;

    res.json({ payments, walletBalance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch provider payments" });
  }
};

// Get all admin earnings
export const getAdminEarnings = async (req, res) => {
  try {
    const earnings = await AdminEarnings.find().sort({ createdAt: -1 });
    res.json(earnings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch admin earnings" });
  }
};
