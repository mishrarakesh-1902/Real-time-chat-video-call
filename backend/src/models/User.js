

import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please use a valid email address",
      ],
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🚨 never return password by default
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/* =====================
   SAFE MODEL EXPORT
===================== */
const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

export default User;
