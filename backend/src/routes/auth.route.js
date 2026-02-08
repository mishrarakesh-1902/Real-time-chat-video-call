import express from "express";
import jwt from "jsonwebtoken";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

const router = express.Router();

/* =====================
   SECURITY / RATE LIMIT
===================== */
router.use(arcjetProtection);

/* =====================
   PUBLIC ROUTES
===================== */
router.post("/signup", signup);
router.post("/login", login);

/* =====================
   PROTECTED ROUTES
===================== */
router.post("/logout", protectRoute, logout);
router.put("/update-profile", protectRoute, updateProfile);

/* =====================
   AUTH CHECK (SAFE)
   - NEVER returns 401
   - Returns user or null
===================== */
router.get("/check", async (req, res) => {
  try {
    if (!ENV.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing");
      return res.status(200).json(null);
    }

    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(200).json(null);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, ENV.JWT_SECRET);
    } catch {
      return res.status(200).json(null);
    }

    const user = await User.findById(
      decoded.userId
    ).select("_id fullName email profilePic");

    return res.status(200).json(user || null);
  } catch (error) {
    console.error("Auth check error:", error);
    return res.status(200).json(null);
  }
});

export default router;
