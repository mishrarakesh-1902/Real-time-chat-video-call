
import arcjet, {
  shield,
  detectBot,
  slidingWindow,
} from "@arcjet/node";
import { ENV } from "./env.js";

/*
  Decide mode based on environment
  - production → LIVE (block)
  - development → DRY_RUN (log only)
*/
const MODE =
  ENV.NODE_ENV === "production" ? "LIVE" : "DRY_RUN";

/*
  If ARCJET_KEY is missing, disable Arcjet gracefully
  (prevents server crash in local/dev)
*/
let aj = null;

if (!ENV.ARCJET_KEY) {
  console.warn(
    "⚠️ ARCJET_KEY missing — Arcjet protection disabled"
  );

  // fallback middleware (does nothing)
  aj = async (_req, _res, next) => next();
} else {
  aj = arcjet({
    key: ENV.ARCJET_KEY,
    rules: [
      // Protect against common attacks (SQLi, XSS, etc.)
      shield({ mode: MODE }),

      // Bot detection
      detectBot({
        mode: MODE,
        allow: [
          "CATEGORY:SEARCH_ENGINE",
          // "CATEGORY:MONITOR",
          // "CATEGORY:PREVIEW",
        ],
      }),

      // Rate limiting
      slidingWindow({
        mode: MODE,
        max: 100,
        interval: 60, // seconds
      }),
    ],
  });
}

export default aj;
