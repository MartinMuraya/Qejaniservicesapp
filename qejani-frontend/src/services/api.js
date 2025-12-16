import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Axios instance with token automatically attached
const token = localStorage.getItem("token");

const apiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

// --- User & Orders ---
export const api = {
  getServices: () => apiInstance.get("/services"),
  getProvidersByService: (serviceId) => apiInstance.get(`/providers/service/${serviceId}`),
  createOrder: (data) => apiInstance.post("/orders", data),
  getUserOrders: () => apiInstance.get("/orders/user"),

  // --- M-Pesa / Payments ---
  stkPush: (phone, amount, providerId) =>
    apiInstance.post(`/mpesa/stkpush?providerId=${providerId}`, { phone, amount }),
  getProviderPayments: (providerId) =>
    apiInstance.get(`/data/payments/provider/${providerId}`),

  // --- Admin ---
  getAdminEarnings: () => apiInstance.get("/admin/earnings"),
  getAdminProviders: () => apiInstance.get("/admin/providers"),
  getAdminWallet: () => apiInstance.get("/admin/wallet"),
  getAdminWithdrawals: () => apiInstance.get("/admin/withdrawals"),
  withdrawAdminWallet: (phone) => apiInstance.post("/admin/withdraw", { phone }),
};
