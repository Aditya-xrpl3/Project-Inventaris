// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // sesuaikan dengan backend Django kamu
});

// Interceptor: otomatis kirim token ke backend
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
