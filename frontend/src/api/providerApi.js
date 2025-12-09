import axios from "axios";

const API = "http://localhost:5000/api/data";

export const fetchProviderData = (providerId) =>
  axios.get(`${API}/payments/provider/${providerId}`);

export const providerWithdraw = (providerId, data) =>
  axios.post(`${API}/provider/withdraw/${providerId}`, data);
