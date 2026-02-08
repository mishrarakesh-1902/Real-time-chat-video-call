import express from "express";
import mongoose from "mongoose";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

/*
  Middleware order:
  1. arcjetProtection → rate limit / bot protection
  2. protectRoute    → attach req.user
*/
router.use(arcjetProtection);
router.use(protectRoute);

/* =====================
   CONTACTS & CHATS
===================== */
router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);

/* =====================
   ID VALIDATION MIDDLEWARE
===================== */
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }
  next();
};

/* =====================
   MESSAGES
===================== */
router.get("/:id", validateObjectId, getMessagesByUserId);

// SEND MESSAGE (TEXT / IMAGE)
router.post("/send/:id", validateObjectId, sendMessage);

export default router;
