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
===================== */
const allowedOrigins = (() => {
  const origins = [
    "http://localhost:5173", // Development
    "https://real-time-chat-video-call-1.onrender.com", // Frontend production
  ];
  
  // Add CLIENT_URL if it's set and not already in the list
  if (ENV.CLIENT_URL && !origins.includes(ENV.CLIENT_URL)) {
    origins.push(ENV.CLIENT_URL);
  }
  
  return origins;
})();

/* =====================
   CORS CHECK HELPER
===================== */
const corsOriginCheck = (origin, callback) => {
  // Allow requests with no origin (like mobile apps or curl)
  if (!origin) return callback(null, true);
  
  // Allow if origin is in allowed list
  if (allowedOrigins.includes(origin)) return callback(null, true);
  
  // In production without CLIENT_URL, deny all origins (credentials won't work anyway)
  if (ENV.NODE_ENV === "production" && !ENV.CLIENT_URL) {
    return callback(new Error("CORS not allowed - CLIENT_URL not configured"));
  }
  
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
===================== */
const io = new Server(server, {
  cors: {
    origin: corsOriginCheck,
    credentials: true,
  },
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
===================== */
io.on("connection", (socket) => {
  const userId = socket.userId;
  const user = socket.user;

  if (!userId || !user) {
    console.warn("⚠️ Socket connected without user");
    socket.disconnect();
    return;
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
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", user.fullName);

    // Remove only if same socket
    if (userSocketMap.get(userId) === socket.id) {
      userSocketMap.delete(userId);
    }

    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });
});

export { io, app, server };
