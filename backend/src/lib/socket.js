import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

/* =====================
   APP + SERVER
===================== */
const app = express();
const server = http.createServer(app);

/* =====================
   BODY PARSER (CRITICAL)
===================== */
app.use(express.json({ limit: "5mb" }));

/* =====================
   ALLOWED ORIGINS
   IMPORTANT: Frontend and backend should use the SAME domain for cookies to work
   - This backend runs on: https://real-time-chat-video-call-1.onrender.com
   - Frontend axios/socket should use: https://real-time-chat-video-call-1.onrender.com
   - For development: http://localhost:5173 (Vite default)
   - Also allow localhost:3000 for backend testing
===================== */
const allowedOrigins = [
  "http://localhost:5173", // Vite development
  "http://localhost:3000", // Backend development
  "https://real-time-chat-video-call-1.onrender.com", // Production (both frontend & backend)
];

// Add CLIENT_URL if it's set and different (for separate frontend deployments)
if (ENV.CLIENT_URL && !allowedOrigins.includes(ENV.CLIENT_URL)) {
  allowedOrigins.push(ENV.CLIENT_URL);
}

/* =====================
   CORS CHECK HELPER
===================== */
const corsOriginCheck = (origin, callback) => {
  // Allow requests with no origin (like mobile apps or curl)
  if (!origin) return callback(null, true);
  
  // Allow if origin is in allowed list
  if (allowedOrigins.includes(origin)) return callback(null, true);
  
  // Allow Render's internal requests and any .onrender.com subdomain
  if (origin.includes(".onrender.com")) return callback(null, true);
  
  return callback(new Error("CORS not allowed"));
};

/* =====================
   HTTP CORS
===================== */
app.use(
  cors({
    origin: corsOriginCheck,
    credentials: true,
  })
);

/* =====================
   SOCKET.IO
   Improved for Render free tier cold starts
===================== */
const io = new Server(server, {
  cors: {
    origin: corsOriginCheck,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,        // 60s timeout for pong
  pingInterval: 25000,       // 25s ping interval
  allowUpgrades: true,
  perMessageDeflate: false,   // Disable compression for stability
});

/* =====================
   SOCKET AUTH
===================== */
io.use(socketAuthMiddleware);

/* =====================
   ONLINE USERS (SAFE MAP)
===================== */
const userSocketMap = new Map(); // userId -> socketId

export function getReceiverSocketId(userId) {
  return userSocketMap.get(userId);
}

/* =====================
   SOCKET EVENTS
   Handle unauthenticated connections gracefully for cold starts
===================== */
io.on("connection", (socket) => {
  const userId = socket.userId;
  const user = socket.user;

  // Log connection attempt
  console.log(`🔌 Socket connected: userId=${userId}, connected=${socket.connected}`);

  // If no userId, this is an unauthenticated connection
  // Don't disconnect immediately - allow re-authentication
  if (!userId || !user) {
    console.warn("⚠️ Socket connected without authentication - waiting for auth");
    
    // Set a timeout to disconnect unauthenticated sockets
    const authTimeout = setTimeout(() => {
      if (!socket.userId && socket.connected) {
        console.warn("⚠️ Unauthenticated socket timed out - disconnecting");
        socket.disconnect();
      }
    }, 30000); // 30 seconds to authenticate

    // Allow re-authentication via event
    socket.on("authenticate", async (token) => {
      clearTimeout(authTimeout);
      try {
        const jwt = await import("jsonwebtoken");
        const decoded = jwt.default.verify(token, ENV.JWT_SECRET);
        const User = await import("../models/User.js");
        const authenticatedUser = await User.default.findById(decoded.userId).select("_id fullName profilePic");
        
        if (authenticatedUser && socket.connected) {
          socket.user = authenticatedUser;
          socket.userId = authenticatedUser._id.toString();
          console.log("✅ Socket re-authenticated:", authenticatedUser.fullName);
          
          // Track online user
          userSocketMap.set(socket.userId, socket.id);
          io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
        } else if (socket.connected) {
          socket.disconnect();
        }
      } catch (error) {
        console.error("Socket re-authentication failed:", error.message);
        if (socket.connected) {
          socket.disconnect();
        }
      }
    });

    // Handle disconnect for unauthenticated socket
    socket.on("disconnect", (reason) => {
      console.log("❌ Unauthenticated socket disconnected:", reason);
      clearTimeout(authTimeout);
    });

    return; // Don't proceed with authenticated-only features
  }

  console.log("✅ Socket connected:", user.fullName);

  // Track online user
  userSocketMap.set(userId, socket.id);
  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  /* ==================================================
     VIDEO CALL SIGNALING
    ================================================== */

  // 1️⃣ CALL INITIATE
  socket.on("video-call:initiate", ({ toUserId }) => {
    if (!toUserId) return;

    const receiverSocketId = userSocketMap.get(toUserId);
    if (!receiverSocketId) return;

    io.to(receiverSocketId).emit("video-call:incoming", {
      fromUserId: userId,
      fromUser: {
        _id: user._id,
        fullName: user.fullName,
        avatar: user.profilePic,
      },
    });
  });

  // 2️⃣ CALL ACCEPT
  socket.on("video-call:accept", ({ toUserId }) => {
    if (!toUserId) return;

    const receiverSocketId = userSocketMap.get(toUserId);
    if (!receiverSocketId) return;

    io.to(receiverSocketId).emit("video-call:accepted", {
      byUserId: userId,
    });
  });

  // 3️⃣ CALL REJECT
  socket.on("video-call:reject", ({ toUserId }) => {
    if (!toUserId) return;

    const receiverSocketId = userSocketMap.get(toUserId);
    if (!receiverSocketId) return;

    io.to(receiverSocketId).emit("video-call:rejected", {
      byUserId: userId,
    });
  });

  // 4️⃣ WEBRTC OFFER
  socket.on("webrtc:offer", ({ toUserId, offer }) => {
    if (!toUserId || !offer) return;

    const receiverSocketId = userSocketMap.get(toUserId);
    if (!receiverSocketId) return;

    io.to(receiverSocketId).emit("webrtc:offer", {
      fromUserId: userId,
      offer,
    });
  });

  // 5️⃣ WEBRTC ANSWER
  socket.on("webrtc:answer", ({ toUserId, answer }) => {
    if (!toUserId || !answer) return;

    const receiverSocketId = userSocketMap.get(toUserId);
    if (!receiverSocketId) return;

    io.to(receiverSocketId).emit("webrtc:answer", {
      fromUserId: userId,
      answer,
    });
  });

  // 6️⃣ ICE CANDIDATES
  socket.on("webrtc:ice-candidate", ({ toUserId, candidate }) => {
    if (!toUserId || !candidate) return;

    const receiverSocketId = userSocketMap.get(toUserId);
    if (!receiverSocketId) return;

    io.to(receiverSocketId).emit("webrtc:ice-candidate", {
      fromUserId: userId,
      candidate,
    });
  });

  // 7️⃣ END CALL
  socket.on("video-call:end", ({ toUserId }) => {
    if (!toUserId) return;

    const receiverSocketId = userSocketMap.get(toUserId);
    if (!receiverSocketId) return;

    io.to(receiverSocketId).emit("video-call:ended", {
      byUserId: userId,
    });
  });

  /* =====================
     DISCONNECT
    ===================== */
  socket.on("disconnect", (reason) => {
    console.log(`❌ Socket disconnected: ${user?.fullName || 'unknown'}, reason: ${reason}`);

    // Only update user map if this was an authenticated user with matching socket
    if (userId && userSocketMap.get(userId) === socket.id) {
      userSocketMap.delete(userId);
      io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    }
  });
});

export { io, app, server };
