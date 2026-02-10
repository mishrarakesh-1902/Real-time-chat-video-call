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
  reconnectionAttempts: 10,        // More retry attempts
  reconnectionDelay: 2000,         // Start with 2 seconds
  reconnectionDelayMax: 30000,     // Max 30 seconds between retries
  timeout: 60000,                  // 60 seconds timeout for connection

  // Transport options - try websocket first, fall back to polling
  transports: ["websocket", "polling"],

  // Pass token in auth object for socket.io
  auth: {
    token: null,
  },
});

// Track connection state
let connectionErrorListeners = [];

/*
  Listen for connection errors
*/
export const onConnectionError = (callback) => {
  connectionErrorListeners.push(callback);
};

const notifyConnectionError = (error) => {
  connectionErrorListeners.forEach((cb) => cb(error));
};

/*
  Enhanced connection handler with better error handling for Render cold starts
*/
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
  
  // If we have a token, authenticate
  const token = localStorage.getItem("authToken") || socket.auth.token;
  if (token && !socket.userId) {
    socket.emit("authenticate", token);
  }
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
  
  // Log if disconnected during cold start
  if (reason === "io server disconnect") {
    console.log("🔄 Server disconnected - will auto-reconnect");
  }
});

socket.on("connect_error", (error) => {
  console.error("🔌 Socket connection error:", error.message);
  
  // Provide helpful error messages for Render cold starts
  if (error.message.includes("404") || error.message.includes("xhr poll error")) {
    console.warn("⚠️ Server might be starting up (Render cold start). Retrying...");
    notifyConnectionError(error);
  } else if (error.message.includes("CORS")) {
    console.error("🔒 CORS error - check allowed origins configuration");
  } else if (error.message.includes("Unauthorized")) {
    console.warn("🔑 Socket authentication failed - check JWT token");
  }
});

socket.on("reconnect_attempt", (attemptNumber) => {
  console.log(`🔄 Reconnection attempt #${attemptNumber}`);
  
  // Update auth token if available
  const token = localStorage.getItem("authToken");
  if (token) {
    socket.auth.token = token;
  }
});

socket.on("reconnect", (attemptNumber) => {
  console.log(`✅ Socket reconnected after ${attemptNumber} attempts`);
  
  // Re-authenticate after reconnection
  const token = localStorage.getItem("authToken") || socket.auth.token;
  if (token) {
    socket.emit("authenticate", token);
  }
});

socket.on("reconnect_failed", () => {
  console.error("❌ Socket reconnection failed after all attempts");
  notifyConnectionError(new Error("Reconnection failed"));
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
    console.log("🔌 Connecting socket...");
    socket.connect();
  } else {
    // Already connected, just re-authenticate
    socket.emit("authenticate", token);
  }
};

// Logout ke time
export const disconnectSocket = () => {
  localStorage.removeItem("authToken");
  socket.auth.token = null;
  if (socket.connected) {
    socket.disconnect();
  }
};

// Check if socket is connected
export const isSocketConnected = () => socket.connected;
