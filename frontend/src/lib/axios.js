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
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      console.error(`API Error ${status}:`, data);
      
      const message = data?.message || data?.error || `Request failed with status ${status}`;
      
      return Promise.reject(new Error(message));
    } else if (error.request) {
      if (error.code === "ECONNABORTED") {
        console.error("API Timeout: Request timed out");
        return Promise.reject(new Error("Request timed out. Please try again."));
      }
      console.error("Network Error:", error.message);
      return Promise.reject(new Error("Network error. Please check your connection."));
    }
    return Promise.reject(error);
  }
);
