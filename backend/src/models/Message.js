import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    image: {
      type: String,
    },
    document: {
      type: String,
    },
    documentName: {
      type: String,
      trim: true,
      maxlength: 255,
    },
  },
  {
    timestamps: true,
  }
);

/* =====================
   VALIDATION
 ===================== */
// Ensure at least text, image, or document exists
messageSchema.pre("validate", function (next) {
  if (!this.text && !this.image && !this.document) {
    next(
      new Error(
        "Message must contain either text, image, or document"
      )
    );
  } else {
    next();
  }
});

/* =====================
   INDEXES (PERFORMANCE)
 ===================== */
// For chat history queries
messageSchema.index({
  senderId: 1,
  receiverId: 1,
  createdAt: 1,
});

// For reverse direction
messageSchema.index({
  receiverId: 1,
  senderId: 1,
  createdAt: 1,
});

/* =====================
   SAFE MODEL EXPORT
 ===================== */
const Message =
  mongoose.models.Message ||
  mongoose.model("Message", messageSchema);

export default Message;
