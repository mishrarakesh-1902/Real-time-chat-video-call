import { io } from "socket.io-client";

// Use environment variable for Socket URL, fallback to localhost or production URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (
  import.meta.env.PROD
    ? "https://real-time-chat-video-call-3n4r.onrender.com"
    : "http://localhost:3000"
);

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000, // 10 second timeout

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
  if (!socket.connected) {
    socket.connect();
  }
};

// Logout ke time
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
