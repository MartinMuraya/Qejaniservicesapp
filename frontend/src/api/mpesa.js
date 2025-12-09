import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const stkPushPayment = async (providerId, phone, amount) => {
  const res = await axios.post(`${API_BASE}/mpesa/stkpush?providerId=${providerId}`, {
    phone,
    amount,
  });
  return res.data;
};

export const getProviderPayments = async (providerId) => {
  const res = await axios.get(`${API_BASE}/payments/provider/${providerId}`);
  return res.data;
};

export const getAdminEarnings = async () => {
  const res = await axios.get(`${API_BASE}/adminEarnings`);
  return res.data;
};
