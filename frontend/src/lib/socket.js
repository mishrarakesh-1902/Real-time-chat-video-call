import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://real-time-chat-video-call-3n4r.onrender.com";

let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 30000,
      timeout: 60000,
      transports: ["websocket", "polling"],
      auth: { token: null },
    });
  }
  return socketInstance;
};

export const socket = getSocket();

let connectionErrorListeners = [];

export const onConnectionError = (callback) => {
  connectionErrorListeners.push(callback);
};

const notifyConnectionError = (error) => {
  connectionErrorListeners.forEach((cb) => cb(error));
};

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
  
  const token = localStorage.getItem("authToken") || socket.auth.token;
  if (token && !socket.userId) {
    socket.emit("authenticate", token);
  }
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
  if (reason === "io server disconnect") {
    console.log("🔄 Server disconnected - will auto-reconnect");
  }
});

socket.on("connect_error", (error) => {
  console.error("🔌 Socket connection error:", error.message);
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
  const token = localStorage.getItem("authToken");
  if (token) {
    socket.auth.token = token;
  }
});

socket.on("reconnect", (attemptNumber) => {
  console.log(`✅ Socket reconnected after ${attemptNumber} attempts`);
  const token = localStorage.getItem("authToken") || socket.auth.token;
  if (token) {
    socket.emit("authenticate", token);
  }
});

socket.on("reconnect_failed", () => {
  console.error("❌ Socket reconnection failed after all attempts");
  notifyConnectionError(new Error("Reconnection failed"));
});

socket.on("getOnlineUsers", (users) => {
  console.log("📡 Received online users:", users);
  window.dispatchEvent(new CustomEvent("onlineUsersUpdate", { detail: users }));
});

export const connectSocket = (token) => {
  socket.auth.token = token;
  localStorage.setItem("authToken", token);
  if (!socket.connected) {
    console.log("🔌 Connecting socket...");
    socket.connect();
  } else {
    socket.emit("authenticate", token);
  }
};

export const disconnectSocket = () => {
  localStorage.removeItem("authToken");
  socket.auth.token = null;
  if (socket.connected) {
    socket.disconnect();
  }
};

export const isSocketConnected = () => socket.connected;

export const emitAddUser = (userId) => {
  if (socket.connected && userId) {
    socket.emit("addUser", userId);
  }
};
