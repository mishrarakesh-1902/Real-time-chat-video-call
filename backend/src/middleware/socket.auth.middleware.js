
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

/*
  Helper to safely extract cookie value
*/
const getCookie = (cookieHeader, name) => {
  if (!cookieHeader) return null;

  return cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.split("=")[1];
};

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // 🔐 Ensure JWT secret exists
    if (!ENV.JWT_SECRET) {
      console.error("❌ JWT_SECRET is not configured");
      return next(
        new Error("Authentication configuration error")
      );
    }

    // 🍪 Extract JWT from cookies OR from auth object
    const cookieHeader = socket.handshake.headers?.cookie;
    let token = getCookie(cookieHeader, "jwt");

    // Also check auth object (passed by frontend socket.io)
    if (!token && socket.handshake.auth?.token) {
      token = socket.handshake.auth.token;
    }

    if (!token) {
      // Allow connection without token - frontend will authenticate later
      console.log("🔌 Socket connected without token (will authenticate later)");
      socket.user = null;
      socket.userId = null;
      return next();
    }

    let decoded;
    try {
      decoded = jwt.verify(token, ENV.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(
          new Error("Unauthorized - Token expired")
        );
      }
      return next(
        new Error("Unauthorized - Invalid token")
      );
    }

    // 👤 Fetch user
    const user = await User.findById(
      decoded.userId
    ).select("_id fullName profilePic");

    if (!user) {
      return next(new Error("Unauthorized - User not found"));
    }

    // ✅ Attach user info to socket
    socket.user = user;
    socket.userId = user._id.toString();

    if (ENV.NODE_ENV !== "production") {
      console.log(
        `🔌 Socket authenticated: ${user.fullName} (${user._id})`
      );
    }

    return next();
  } catch (error) {
    console.error(
      "Socket authentication error:",
      error
    );
    return next(
      new Error("Unauthorized - Authentication failed")
    );
  }
};
