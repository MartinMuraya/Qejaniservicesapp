import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const userSignup = (data) =>
  axios.post(`${API}/user/signup`, data);

export const userLogin = (data) =>
  axios.post(`${API}/user/login`, data);

export const providerLogin = (data) =>
  axios.post(`${API}/provider/login`, data);

export const adminLogin = (data) =>
  axios.post(`${API}/admin/login`, data);
