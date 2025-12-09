// src/api/userApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// --- Include token for protected routes ---
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// --- Services ---
// Fetch all available services
export const fetchServices = () => API.get("/services");

// --- Providers ---
// Fetch providers by service ID
export const fetchProvidersByService = (serviceId) =>
  API.get(`/providers/service/${serviceId}`);

// --- Orders / Booking ---
// Book a provider for a service
export const bookProvider = (providerId, serviceId) =>
  API.post("/orders", { providerId, serviceId });

// Fetch orders for logged-in user
export const getUserOrders = () => API.get("/orders/user");

// Optional: fetch a single provider by ID
export const getProvider = (providerId) =>
  API.get(`/providers/${providerId}`);
