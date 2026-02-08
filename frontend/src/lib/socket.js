import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.PROD
    ? "https://real-time-chat1-8hhq.onrender.com"
    : "http://localhost:3000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,

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
