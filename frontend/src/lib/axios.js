import axios from "axios";

// Use environment variable for API URL, fallback to localhost or production URL
// IMPORTANT: This must match the backend URL in socket.js CORS configuration
const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD
    ? "https://real-time-chat-video-call-3n4r.onrender.com"
    : "http://localhost:3000"
);

export const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Required for cookies to be sent
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token from localStorage if available (fallback for cross-domain issues)
    const token = localStorage.getItem("authToken");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);
