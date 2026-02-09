import { io } from "socket.io-client";

// Use environment variable for Socket URL, Fallback to localhost or production URL
// IMPORTANT: This must match the backend URL in socket.js CORS configuration
// Check VITE_SOCKET_URL first, then fallback based on environment
const getSocketUrl = () => {
  // If VITE_SOCKET_URL is explicitly set, use it
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  // Otherwise, fallback based on environment
  return import.meta.env.PROD
    ? "https://real-time-chat-video-call-1.onrender.com"
    : "http://localhost:3000";
};

const SOCKET_URL = getSocketUrl();

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true, // Required for cookies to be sent
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 30000, // Increased to 30 seconds for production reliability

  // Transport options - ensure WebSocket and HTTP-polling work
  transports: ["websocket", "polling"],

  // Pass token in auth object for socket.io
  auth: {
    token: null,
  },
});

// =====================
// Helpers
// =====================

// Login ke baad call karo
export const connectSocket = (token) => {
  socket.auth.token = token;
  // Also store in localStorage as fallback
  localStorage.setItem("authToken", token);
  if (!socket.connected) {
    socket.connect();
  }
};

// Logout ke time
export const disconnectSocket = () => {
  localStorage.removeItem("authToken");
  if (socket.connected) {
    socket.disconnect();
  }
};
