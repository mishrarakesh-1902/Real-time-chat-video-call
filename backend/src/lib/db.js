import mongoose from "mongoose";
import { ENV } from "./env.js";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const { MONGO_URI } = ENV;

    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not set");
    }

    const conn = await mongoose.connect(MONGO_URI, {
      autoIndex: ENV.NODE_ENV !== "production",
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(
      `🗄️ MongoDB connected: ${conn.connection.host}`
    );
  } catch (error) {
    console.error(
      "❌ MongoDB connection failed:",
      error.message
    );

    // Let the process manager (Render / PM2) handle restarts
    throw error;
  }
};
