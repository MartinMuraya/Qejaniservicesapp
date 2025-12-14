// controllers/mpesaController.js
import axios from "axios";
import mongoose from "mongoose";
import Provider from "../models/Provider.js";
import Payment from "../models/Payment.js";
import AdminEarnings from "../models/AdminEarnings.js";
import AdminWallet from "../models/AdminWallet.js";
import { io } from "../server.js";

// Helper: Timestamp YYYYMMDDHHmmss
const getTimestamp = () => {
  const date = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
};

// Helper: Get M-Pesa Access Token
const getAccessToken = async () => {
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
  const res = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );
  return res.data.access_token;
};

// STK PUSH
export const stkPush = async (req, res) => {
  const { phone, amount } = req.body;
  const providerId = req.query.providerId?.trim();

  if (!phone || !amount || !providerId) {
    return res.status(400).json({ message: "Phone, amount, and providerId are required" });
  }

  let formattedPhone = phone.toString().replace(/\D/g, "");
  if (formattedPhone.startsWith("0")) formattedPhone = "254" + formattedPhone.slice(1);
  if (formattedPhone.startsWith("+254")) formattedPhone = formattedPhone.slice(1);

  if (!/^2547[1-9]\d{7}$/.test(formattedPhone)) {
    return res.status(400).json({ message: "Invalid phone. Must be 07XXXXXXXX or 2547XXXXXXXX" });
  }

  if (isNaN(amount) || amount < 1) {
    return res.status(400).json({ message: "Amount must be ≥ 1" });
  }

  try {
    const token = await getAccessToken();
    const timestamp = getTimestamp();
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64");

    const stkResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: `PROV_${providerId}`,
        TransactionDesc: "Payment to Provider",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      message: "STK Push sent successfully!",
      data: stkResponse.data,
    });
  } catch (error) {
    console.error("STK Push Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "STK Push failed",
      error: error.response?.data || error.message,
    });
  }
};

// ==========================
// FIXED CALLBACK WITH FULL REAL-TIME UPDATE
// ==========================
export const mpesaCallbackFix = async (req, res) => {
  console.log("====== RAW CALLBACK RECEIVED ======");
  console.log(JSON.stringify(req.body, null, 2));

  const callbackData = req.body?.Body?.stkCallback;

  if (!callbackData) return res.json({ ResultCode: 0, ResultDesc: "Accepted" });

  const { ResultCode, ResultDesc, CallbackMetadata } = callbackData;

  if (ResultCode !== 0) {
    console.log("❌ Payment failed:", ResultDesc);
    return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }

  try {
    const items = CallbackMetadata?.Item || [];

    const amount = items.find(i => i.Name === "Amount")?.Value;
    const mpesaReceipt = items.find(i => i.Name === "MpesaReceiptNumber")?.Value;
    const phone = items.find(i => i.Name === "PhoneNumber")?.Value;
    const accountRef = items.find(i => i.Name === "AccountReference")?.Value || "";

    if (!accountRef.startsWith("PROV_")) return res.json({ ResultCode: 0, ResultDesc: "Accepted" });

    const providerIdString = accountRef.replace("PROV_", "").trim();
    if (!mongoose.Types.ObjectId.isValid(providerIdString)) return res.json({ ResultCode: 0, ResultDesc: "Accepted" });

    const providerId = new mongoose.Types.ObjectId(providerIdString);

    const provider = await Provider.findById(providerId);
    if (!provider) return res.json({ ResultCode: 0, ResultDesc: "Accepted" });

    const commissionRate = provider.commissionRate || 10; // %
    const commission = Math.round(amount * (commissionRate / 100));
    const providerAmount = amount - commission;

    const payment = await Payment.create({
      providerId,
      amount,
      mpesaReceipt,
      phone,
      commission,
      providerAmount,
      status: "paid",
    });

    // 🔹 Update provider wallet
    const updatedProvider = await Provider.findByIdAndUpdate(
      providerId,
      { $inc: { walletBalance: providerAmount } },
      { new: true }
    );

    // 🔹 Update admin wallet
    let adminWallet = await AdminWallet.findOne();
    if (!adminWallet) adminWallet = await AdminWallet.create({ balance: 0 });
    adminWallet.balance += commission;
    await adminWallet.save();

    // 🔹 Record admin earnings
    await AdminEarnings.create({
      providerId,
      paymentId: payment._id,
      amount: commission,
    });

    console.log("✅ PAYMENT PROCESSED SUCCESSFULLY", {
      amount,
      commission,
      providerAmount,
      adminWalletBalance: adminWallet.balance,
    });

    // 🔔 Emit full provider info
    io.emit("provider", updatedProvider);

    // 🔔 Emit dashboard update
   io.emit("dashboardUpdate", {
  type: "payment",
  payment,               // full payment document
  provider: updatedProvider, // full provider info
  adminWalletBalance: adminWallet.balance
  });


    return res.json({ ResultCode: 0, ResultDesc: "Accepted" });

  } catch (error) {
    console.log("❌ ERROR PROCESSING CALLBACK:", error);
    return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
};
