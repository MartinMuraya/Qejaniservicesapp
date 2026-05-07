import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const apiInstance = axios.create({
  baseURL: API_URL,
});

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  getServices: () => apiInstance.get("/services"),
  getProvidersByService: (serviceId) => apiInstance.get(`/providers/service/${serviceId}`),
  getProviderById: (id) => apiInstance.get(`/providers/${id}`),
  getProviderReviews: (id) => apiInstance.get(`/reviews/provider/${id}`),
  getCurrentProvider: () => apiInstance.get("/providers/me"),
  updateProviderProfile: (data) => apiInstance.put("/providers/profile", data),
  createOrder: (data) => apiInstance.post("/orders", data),
  getUserOrders: () => apiInstance.get("/orders/user"),

  // --- M-Pesa / Payments ---
  stkPush: (phone, amount, providerId) =>
    apiInstance.post(`/mpesa/stkpush?providerId=${providerId}`, { phone, amount }),
  getProviderPayments: (providerId) =>
    apiInstance.get(`/data/payments/provider/${providerId}`),

  // --- Admin ---
  getAdminServices: () => apiInstance.get("/admin/services"),
  createAdminService: (data) => apiInstance.post("/admin/services", data),
  updateAdminService: (id, data) => apiInstance.put(`/admin/services/${id}`, data),
  deleteAdminService: (id) => apiInstance.delete(`/admin/services/${id}`),

  getAdminUsers: () => apiInstance.get("/admin/users"),
  updateAdminUser: (id, data) => apiInstance.put(`/admin/users/${id}`, data),
  deleteAdminUser: (id) => apiInstance.delete(`/admin/users/${id}`),
  verifyAdminUser: (id) => apiInstance.patch(`/admin/users/${id}/verify`),
  declineAdminUser: (id) => apiInstance.delete(`/admin/users/${id}/decline`),
  getAdminEarnings: () => apiInstance.get("/admin/earnings"),
  getAdminProviders: () => apiInstance.get("/admin/providers"),
  updateAdminProvider: (id, data) => apiInstance.put(`/admin/providers/${id}`, data),
  deleteAdminProvider: (id) => apiInstance.delete(`/admin/providers/${id}`),
  toggleAdminProviderStatus: (id) => apiInstance.patch(`/admin/providers/${id}/toggle-active`),
  getAdminWallet: () => apiInstance.get("/admin/wallet"),
  getAdminWithdrawals: () => apiInstance.get("/admin/withdrawals"),
  withdrawAdminWallet: (phone) => apiInstance.post("/admin/withdraw", { phone }),

  // --- Profile Picture ---
  uploadProfilePicture: (formData) => apiInstance.post("/providers/profile-picture", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  deleteProfilePicture: () => apiInstance.delete("/providers/profile-picture"),
  sendContactMessage: (data) => apiInstance.post("/contact", data),
};

export default api;
