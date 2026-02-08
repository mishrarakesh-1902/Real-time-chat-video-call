
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/User.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import { ENV } from "../lib/env.js";

/* ===================== SIGNUP ===================== */
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body || {};

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      return res
        .status(400)
        .json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // ✅ issue JWT cookie
    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });

    // send welcome email (non-blocking)
    sendWelcomeEmail(
      newUser.email,
      newUser.fullName,
      ENV.CLIENT_URL
    ).catch((err) =>
      console.error("Welcome email failed:", err)
    );
  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


/* ===================== LOGIN ===================== */
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required" });
  }

  try {
    // 🔑 THIS IS THE FIX (MUST BE EXACT)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // issue JWT cookie
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ===================== LOGOUT ===================== */
export const logout = (_, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite:
      ENV.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 0,
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
};

/* ===================== UPDATE PROFILE ===================== */
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body || {};
    const userId = req.user?._id;

    if (!profilePic) {
      return res.status(400).json({
        message: "Profile picture is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    let uploadResponse;
    try {
      uploadResponse = await cloudinary.uploader.upload(
        profilePic
      );
    } catch (err) {
      console.error("Cloudinary error:", err);
      return res.status(500).json({
        message: "Image upload failed",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(
      "Error in updateProfile controller:",
      error
    );
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
