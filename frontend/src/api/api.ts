import axios from "axios";

// 🚀 CHANGE: Use the VITE variable if it exists, otherwise use localhost
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: BASE_URL, 
  withCredentials: false,
});

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});