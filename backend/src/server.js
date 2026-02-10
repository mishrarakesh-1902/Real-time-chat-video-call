import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

/* =====================
   CORS is already configured in socket.js
   No need to duplicate it here
===================== */

/* =====================
   HEALTH CHECK
   Useful for Render and monitoring
===================== */
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    env: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

/* =====================
   API ROUTES
===================== */
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

/* =====================
   SERVE FRONTEND (PRODUCTION)
   IMPORTANT: Path must be correct relative to this file
   The backend is at: /opt/render/project/src/backend/src/server.js
   Frontend dist is at: /opt/render/project/src/frontend/dist
===================== */
if (ENV.NODE_ENV === "production") {
  // Resolve the correct path to frontend dist
  const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");
  
  console.log(`📂 Serving frontend from: ${frontendDistPath}`);

  app.use(express.static(frontendDistPath));

  // Handle React routing - serve index.html for all non-API routes
  app.get("*", (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith("/api/") || req.path.startsWith("/socket.io")) {
      return next();
    }
    
    // Serve index.html for frontend routes
    const indexPath = path.join(frontendDistPath, "index.html");
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error("❌ Error serving index.html:", err);
        res.status(500).json({ message: "Frontend not built. Run 'npm run build' in frontend directory." });
      }
    });
  });
}

/* =====================
   START SERVER
===================== */
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${ENV.NODE_ENV}`);
      console.log(`🔗 Health check: /health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
