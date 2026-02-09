import axios from "axios";

// Use environment variable for API URL, fallback to localhost or production URL
// IMPORTANT: This must match the backend URL in socket.js CORS configuration
// Check VITE_API_URL first, then fallback based on environment
const getApiUrl = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Otherwise, fallback based on environment
  return import.meta.env.PROD
    ? "https://real-time-chat-video-call-1.onrender.com"
    : "http://localhost:3000";
};

const API_URL = getApiUrl();

export const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Required for cookies to be sent
  timeout: 30000, // Increased to 30 seconds for production reliability
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
    // Handle common errors with better logging
    if (error.response) {
      // Server responded with error
      console.error("API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      if (error.code === "ECONNABORTED") {
        console.error("API Timeout: Request timed out. Check network connectivity.");
      } else {
        console.error("Network Error:", error.message);
      }
    }
    return Promise.reject(error);
  }
);
