import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://real-time-chat-video-call-3n4r.onrender.com";

export const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      if (error.code === "ECONNABORTED") {
        console.error("API Timeout");
      } else {
        console.error("Network Error:", error.message);
      }
    }
    return Promise.reject(error);
  }
);
