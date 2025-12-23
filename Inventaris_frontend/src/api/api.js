// src/api/api.js
import axios from "axios";

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
// Jika di Vercel, kita gunakan relative path "/" karena backend di-serve di domain yg sama via vercel.json
// Jika di local (atau akses via IP HP), kita gunakan port 8000.
const baseURL = isLocal || window.location.hostname.includes("192.168") 
  ? `${window.location.protocol}//${window.location.hostname}:8000`
  : "/"; 

const api = axios.create({
  baseURL: baseURL,
});

// Interceptor untuk request: tambah Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor untuk response: handle 401 (token expired) dengan refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${baseURL}api/token/refresh/`,
            {
              refresh: refreshToken,
            }
          );
          localStorage.setItem("token", res.data.access);
          error.config.headers.Authorization = `Bearer ${res.data.access}`;
          return api(error.config); // Retry request dengan token baru
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login"; // Redirect ke login
        }
      } else {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
