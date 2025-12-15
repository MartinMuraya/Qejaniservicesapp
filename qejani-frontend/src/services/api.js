import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export const api = {
  getServices: () => axios.get(`${API_URL}/services`),
  getProvidersByService: (serviceId) => axios.get(`${API_URL}/providers/service/${serviceId}`),
  createOrder: (data) => axios.post(`${API_URL}/orders`, data),
  getUserOrders: () => axios.get(`${API_URL}/orders/user`),
  stkPush: (phone, amount, providerId) => axios.post(`${API_URL}/mpesa/stkpush?providerId=${providerId}`, { phone, amount }),
  getProviderPayments: (providerId) => axios.get(`${API_URL}/data/payments/provider/${providerId}`),
  getAdminEarnings: () => axios.get(`${API_URL}/data/adminEarnings`),
  getWithdrawals: () => axios.get(`${API_URL}/admin/withdrawals`),

}