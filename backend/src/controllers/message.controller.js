import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

/* ===================== GET ALL CONTACTS ===================== */
export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const users = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== GET MESSAGES ===================== */
export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessagesByUserId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ===================== SEND MESSAGE ===================== */
export const sendMessage = async (req, res) => {
  try {
    const { text, image, document, documentName } = req.body || {};
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid receiver id" });
    }

    if (!text && !image && !document) {
      return res.status(400).json({
        message: "Text, image, or document is required",
      });
    }

    if (senderId.toString() === receiverId.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot send message to yourself" });
    }

    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    /* ===== IMAGE UPLOAD (OPTIONAL) ===== */
    let imageUrl;
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return res
          .status(500)
          .json({ message: "Image upload failed" });
      }
    }

    /* ===== DOCUMENT UPLOAD (OPTIONAL) ===== */
    let documentUrl;
    if (document) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(document, {
          resource_type: "auto",
          folder: "chat_documents",
        });
        documentUrl = uploadResponse.secure_url;
      } catch (err) {
        console.error("Document upload failed:", err);
        return res
          .status(500)
          .json({ message: "Document upload failed" });
      }
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      document: documentUrl,
      documentName,
    });

    /* ===== REALTIME SOCKET EMIT (NON-BLOCKING) ===== */
    try {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId && io) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    } catch (socketError) {
      console.error("Socket emit failed:", socketError);
      // DO NOT fail message sending
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ===================== GET CHAT PARTNERS ===================== */
export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const messages = await Message.find(
      {
        $or: [
          { senderId: loggedInUserId },
          { receiverId: loggedInUserId },
        ],
      },
      { senderId: 1, receiverId: 1 } // ✅ fetch only needed fields
    );

    const partnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const partners = await User.find({
      _id: { $in: partnerIds },
    }).select("-password");

    res.status(200).json(partners);
  } catch (error) {
    console.error("Error in getChatPartners:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
