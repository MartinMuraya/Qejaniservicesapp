import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Helper to get current timestamp in YYYYMMDDHHMMSS format
const getTimestamp = () => {
  const date = new Date();
  const YYYY = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const DD = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const SS = String(date.getSeconds()).padStart(2, "0");
  return `${YYYY}${MM}${DD}${HH}${mm}${SS}`;
};

// Helper to get access token
const getAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    throw new Error("Failed to get access token: " + (error.response?.data?.errorMessage || error.message));
  }
};

// STK Push Controller
export const stkPush = async (req, res) => {
  const { phone, amount } = req.body;

  if (!phone || !amount) {
    return res.status(400).json({ message: "Phone and amount are required" });
  }

  // Format phone to 254xxxxxxxxx
  let formattedPhone = phone.toString();
  if (formattedPhone.startsWith("0")) {
    formattedPhone = `254${formattedPhone.slice(1)}`;
  } else if (formattedPhone.startsWith("+254")) {
    formattedPhone = formattedPhone.slice(1);
  }
  if (!formattedPhone.startsWith("254") || formattedPhone.length !== 12) {
    return res.status(400).json({ message: "Phone must be in 254xxxxxxxxx format (12 digits)" });
  }

  if (isNaN(amount) || amount < 1) {
    return res.status(400).json({ message: "Amount must be a positive integer" });
  }

  try {
    const token = await getAccessToken();
    const timestamp = getTimestamp();
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

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
        AccountReference: "Service Payment",
        TransactionDesc: "Payment for services",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      message: "STK Push initiated",
      data: stkResponse.data,
    });
  } catch (error) {
    console.error("STK Push Error:", error.response?.data || error.message);
    res.status(500).json({
      message: "STK Push failed",
      error: error.response?.data?.errorMessage || error.message,
    });
  }
};

// STK Push Callback Controller
export const stkCallback = (req, res) => {
  const callbackData = req.body.Body?.stkCallback;

  if (!callbackData) {
    console.log("Invalid callback data");
    return res.status(400).json({ message: "Invalid callback data" });
  }

  console.log("STK Callback received:", JSON.stringify(callbackData, null, 2));

  // TODO: Process the result (e.g., save to DB)
  // If ResultCode === 0, payment succeeded; else, failed with ResultDesc

  // Acknowledge receipt to Safaricom
  res.json({ ResultCode: 0, ResultDesc: "Accepted" });
};