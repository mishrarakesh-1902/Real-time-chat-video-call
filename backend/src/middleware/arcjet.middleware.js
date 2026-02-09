
import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";
import { ENV } from "../lib/env.js";

/*
  Skip Arcjet protection for:
  - Socket.IO polling requests
  - Auth routes (signup, login, check)
  - Health check endpoint
*/
const shouldSkipArcjet = (req) => {
  const path = req.path;
  
  // Skip Socket.IO polling requests
  if (path.startsWith("/socket.io")) {
    return true;
  }
  
  // Skip auth routes (they have their own rate limiting)
  if (path.startsWith("/api/auth/signup") ||
      path.startsWith("/api/auth/login") ||
      path.startsWith("/api/auth/check")) {
    return true;
  }
  
  // Skip health check
  if (path === "/health") {
    return true;
  }
  
  return false;
};

export const arcjetProtection = async (req, res, next) => {
  try {
    // Skip certain routes
    if (shouldSkipArcjet(req)) {
      return next();
    }
    
    // If Arcjet is disabled or using dummy client
    if (!aj || typeof aj.protect !== "function") {
      return next();
    }

    const decision = await aj.protect(req);

    if (decision?.isDenied?.()) {
      if (decision.reason?.isRateLimit?.()) {
        return res.status(429).json({
          message:
            "Too many requests. Please try again later.",
        });
      }

      if (decision.reason?.isBot?.()) {
        return res.status(403).json({
          message: "Automated access is not allowed.",
        });
      }

      return res.status(403).json({
        message: "Access denied by security policy.",
      });
    }

    // Check for spoofed bots safely
    if (
      Array.isArray(decision?.results) &&
      decision.results.some(isSpoofedBot)
    ) {
      return res.status(403).json({
        message: "Malicious bot activity detected.",
      });
    }

    return next();
  } catch (error) {
    if (ENV.NODE_ENV !== "production") {
      console.error(
        "Arcjet middleware error:",
        error
      );
    } else {
      console.error("Arcjet middleware error");
    }

    // Fail open (do not block real users)
    return next();
  }
};
