
import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";
import { ENV } from "../lib/env.js";

export const arcjetProtection = async (req, res, next) => {
  try {
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
