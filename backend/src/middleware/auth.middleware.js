import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

/*
  Extract token from cookies OR Authorization header
  Supports both cookie-based and header-based auth
*/
const extractToken = (req) => {
  // Try cookies first
  if (req.cookies?.jwt) {
    return req.cookies.jwt;
  }
  
  // Try Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  
  return null;
};

export const protectRoute = async (req, res, next) => {
  try {
    // 🔐 Ensure JWT secret exists
    if (!ENV.JWT_SECRET) {
      console.error("❌ JWT_SECRET is not configured");
      return res.status(500).json({
        message: "Authentication configuration error",
      });
    }

    // 🍪 Extract JWT from cookies or header
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, ENV.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Unauthorized - Token expired",
        });
      }

      return res.status(401).json({
        message: "Unauthorized - Invalid token",
      });
    }

    // 👤 Fetch user
    const user = await User.findById(decoded.userId).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized - User not found",
      });
    }

    // ✅ Attach user to request
    req.user = user;
    return next();
  } catch (error) {
    console.error(
      "Auth middleware unexpected error:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
