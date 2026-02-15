import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: "5mb" }));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://real-time-chat-video-call-1.onrender.com",
  "https://real-time-chat-video-call-3n4r.onrender.com",
];

if (ENV.CLIENT_URL && !allowedOrigins.includes(ENV.CLIENT_URL)) {
  allowedOrigins.push(ENV.CLIENT_URL);
}

const corsOriginCheck = (origin, callback) => {
  if (!origin) return callback(null, true);
  if (allowedOrigins.includes(origin)) return callback(null, true);
  if (origin.includes(".onrender.com")) return callback(null, true);
  return callback(new Error("CORS not allowed"));
};

app.use(
  cors({
    origin: corsOriginCheck,
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: corsOriginCheck,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
  allowUpgrades: true,
  perMessageDeflate: false,
});

io.use(socketAuthMiddleware);

const onlineUsers = new Map();

export function getReceiverSocketId(userId) {
  return onlineUsers.get(userId);
}

io.on("connection", async (socket) => {
  const userId = socket.userId;
  const user = socket.user;

  console.log(`🔌 Socket connected: userId=${userId}, socket.id=${socket.id}`);

  if (!userId || !user) {
    console.warn("⚠️ Socket connected without authentication - waiting for auth");
    
    const authTimeout = setTimeout(() => {
      if (!socket.userId && socket.connected) {
        console.warn("⚠️ Unauthenticated socket timed out - disconnecting");
        socket.disconnect();
      }
    }, 30000);

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
          
          // Update user online status in database
          await User.default.findByIdAndUpdate(socket.userId, { isOnline: true });
          
          onlineUsers.set(socket.userId, socket.id);
          io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
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

    socket.on("disconnect", (reason) => {
      console.log("❌ Unauthenticated socket disconnected:", reason);
      clearTimeout(authTimeout);
    });

    return;
  }

  console.log("✅ Socket authenticated:", user.fullName);

  // Update user online status in database
  const User = await import("../models/User.js");
  await User.default.findByIdAndUpdate(userId, { isOnline: true });

  onlineUsers.set(userId, socket.id);
  io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

  socket.on("addUser", (userIdToAdd) => {
    if (userIdToAdd && socket.id) {
      onlineUsers.set(userIdToAdd, socket.id);
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
      console.log(`👤 User added to online list: ${userIdToAdd}`);
    }
  });

  socket.on("video-call:initiate", ({ toUserId }) => {
    if (!toUserId) return;
    const receiverSocketId = onlineUsers.get(toUserId);
    if (!receiverSocketId) return;
    io.to(receiverSocketId).emit("video-call:incoming", {
      fromUserId: userId,
      fromUser: { _id: user._id, fullName: user.fullName, avatar: user.profilePic },
    });
  });

  socket.on("video-call:accept", ({ toUserId }) => {
    if (!toUserId) return;
    const receiverSocketId = onlineUsers.get(toUserId);
    if (!receiverSocketId) return;
    io.to(receiverSocketId).emit("video-call:accepted", { byUserId: userId });
  });

  socket.on("video-call:reject", ({ toUserId }) => {
    if (!toUserId) return;
    const receiverSocketId = onlineUsers.get(toUserId);
    if (!receiverSocketId) return;
    io.to(receiverSocketId).emit("video-call:rejected", { byUserId: userId });
  });

  socket.on("webrtc:offer", ({ toUserId, offer }) => {
    if (!toUserId || !offer) return;
    const receiverSocketId = onlineUsers.get(toUserId);
    if (!receiverSocketId) return;
    io.to(receiverSocketId).emit("webrtc:offer", { fromUserId: userId, offer });
  });

  socket.on("webrtc:answer", ({ toUserId, answer }) => {
    if (!toUserId || !answer) return;
    const receiverSocketId = onlineUsers.get(toUserId);
    if (!receiverSocketId) return;
    io.to(receiverSocketId).emit("webrtc:answer", { fromUserId: userId, answer });
  });

  socket.on("webrtc:ice-candidate", ({ toUserId, candidate }) => {
    if (!toUserId || !candidate) return;
    const receiverSocketId = onlineUsers.get(toUserId);
    if (!receiverSocketId) return;
    io.to(receiverSocketId).emit("webrtc:ice-candidate", { fromUserId: userId, candidate });
  });

  socket.on("video-call:end", ({ toUserId }) => {
    if (!toUserId) return;
    const receiverSocketId = onlineUsers.get(toUserId);
    if (!receiverSocketId) return;
    io.to(receiverSocketId).emit("video-call:ended", { byUserId: userId });
  });

  socket.on("disconnect", async (reason) => {
    console.log(`❌ Socket disconnected: ${user?.fullName || 'unknown'}, reason: ${reason}`);
    
    // Update user online status in database
    if (userId) {
      const User = await import("../models/User.js");
      await User.default.findByIdAndUpdate(userId, { isOnline: false });
    }
    
    for (let [uid, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(uid);
        console.log(`👤 User removed from online list: ${uid}`);
        break;
      }
    }
    
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });
});

export { io, app, server };
