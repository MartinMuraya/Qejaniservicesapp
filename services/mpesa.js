import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// ------------------------
// Generate Access Token
// ------------------------
export const generateToken = async () => {
  const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");

  const response = await axios.get(url, {
    headers: { Authorization: `Basic ${auth}` },
  });

  return response.data.access_token;
};

// ------------------------
// STK PUSH
// ------------------------
export const stkPush = async ({ phone, amount, accountRef, transactionDesc }) => {
  const token = await generateToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
  const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64");

  let formattedPhone = phone.toString().replace(/\D/g, "");
  if (formattedPhone.startsWith("0")) formattedPhone = "254" + formattedPhone.slice(1);
  if (formattedPhone.startsWith("+254")) formattedPhone = formattedPhone.slice(1);

  const response = await axios.post(
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
      AccountReference: accountRef,
      TransactionDesc: transactionDesc || "Payment",
    },
    {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }
  );

  return response.data;
};

// ------------------------
// B2C Payout (Pay Provider)
// ------------------------
export const b2cPayout = async ({ phone, amount, remarks = "Payment" }) => {
  const token = await generateToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
  const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64");

  let formattedPhone = phone.toString().replace(/\D/g, "");
  if (formattedPhone.startsWith("0")) formattedPhone = "254" + formattedPhone.slice(1);
  if (formattedPhone.startsWith("+254")) formattedPhone = formattedPhone.slice(1);

  const response = await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest",
    {
      InitiatorName: process.env.MPESA_INITIATOR_NAME,
      SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
      CommandID: "BusinessPayment",
      Amount: amount,
      PartyA: process.env.MPESA_SHORTCODE,
      PartyB: formattedPhone,
      Remarks: remarks,
      QueueTimeOutURL: process.env.MPESA_B2C_TIMEOUT_URL,
      ResultURL: process.env.MPESA_B2C_RESULT_URL,
      Occasion: "Payout",
    },
    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
  );

  return response.data;
};
