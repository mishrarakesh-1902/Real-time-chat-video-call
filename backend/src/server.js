import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    env: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (ENV.NODE_ENV === "production") {
  const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");
  
  console.log(`📂 Frontend path: ${frontendDistPath}`);
  console.log(`📂 Path exists: ${fs.existsSync(frontendDistPath)}`);
  
  if (!fs.existsSync(frontendDistPath)) {
    console.error("❌ Frontend build not found!");
    app.get("*", (_req, res) => {
      res.status(500).json({
        message: "Frontend not built. Run 'cd frontend && npm run build' first.",
      });
    });
  } else {
    app.use(express.static(frontendDistPath));
    
    app.get("*", (req, res) => {
      if (req.path.startsWith("/api/") || req.path.startsWith("/socket.io")) {
        return res.status(404).json({ message: "API endpoint not found" });
      }
      
      const indexPath = path.join(frontendDistPath, "index.html");
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error("❌ Error sending index.html:", err);
          res.status(500).json({ message: "Error serving frontend" });
        }
      });
    });
    
    console.log("✅ Frontend static files configured");
  }
}

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected");

    server.listen(ENV.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${ENV.PORT || 5000}`);
      console.log(`📝 Environment: ${ENV.NODE_ENV}`);
      console.log(`🔗 Health check: /health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
