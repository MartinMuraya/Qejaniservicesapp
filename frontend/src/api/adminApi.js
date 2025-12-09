// src/api/adminApi.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Admin endpoints
export const fetchProviders = () => API.get("/admin/providers");
export const createProvider = (formData) =>
  API.post("/admin/providers", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const fetchAdminEarnings = () => API.get("/data/adminEarnings");
export const fetchAllTransactions = () => API.get("/admin/transactions");
export const adminWithdraw = (payload) => API.post("/admin/withdraw", payload);

// provider-specific
export const updateProvider = (id, body) => API.put(`/admin/providers/${id}`, body);
export const deleteProvider = (id) => API.delete(`/admin/providers/${id}`);

export default API;
