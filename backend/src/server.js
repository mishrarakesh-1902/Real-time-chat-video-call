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
// Calculate the correct origin for CORS
const getCorsOrigin = () => {
  if (ENV.CLIENT_URL) {
    // Production or when CLIENT_URL is set
    return ENV.CLIENT_URL;
  }
  
  // Development fallback - allow localhost
  if (ENV.NODE_ENV !== "production") {
    return "http://localhost:5173";
  }
  
  // Production without CLIENT_URL - this is problematic, but we try the request origin
  return true; // Allow any origin but credentials will still work
};

app.use(cors({
  origin: getCorsOrigin(),
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
