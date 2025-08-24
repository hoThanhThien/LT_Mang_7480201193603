import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // Đổi nếu dùng domain khác

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// ✅ Gắn token nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
    }
    return Promise.reject(error);
  }
);
