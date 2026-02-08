import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

/* =====================
   CORS CONFIG
===================== */
// List of allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173", // Development
  "https://real-time-chat-video-call-1.onrender.com", // Frontend production
  "https://real-time-chat1-8hhq.onrender.com", // Backend production (if needed)
];

const getCorsOrigin = (req) => {
  const requestOrigin = req.headers.origin;
  
  // Check if the request origin is in our allowed list
  if (allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }
  
  // Fallback to CLIENT_URL env var if set
  if (ENV.CLIENT_URL && allowedOrigins.includes(ENV.CLIENT_URL)) {
    return ENV.CLIENT_URL;
  }
  
  // If in production and no match, return the request origin anyway
  if (ENV.NODE_ENV === "production") {
    return requestOrigin || true;
  }
  
  return "http://localhost:5173";
};

app.use(cors({
  origin: getCorsOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

/* =====================
   HEALTH CHECK
===================== */
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    env: ENV.NODE_ENV,
  });
});

/* =====================
   ROUTES
===================== */
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

/* =====================
   SERVE FRONTEND (PROD)
===================== */
if (ENV.NODE_ENV === "production") {
  app.use(
    express.static(
      path.join(__dirname, "../frontend/dist")
    )
  );

  app.get("*", (_req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend/dist/index.html")
    );
  });
}

/* =====================
   START SERVER
===================== */
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(
        `🚀 Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Failed to start server:",
      error
    );
    process.exit(1);
  }
};

startServer();
