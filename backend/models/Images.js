const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    diseaseDetected: {
      type: String,
      required: true,
      default: "pending",
    },
    confidence: {
      type: Number,
    },
    advisory: {
      description: String,
      symptoms: [String],
      causes: [String],
      treatment: [String],
      prevention: [String],
    },
  },
  { timestamps: true },
);

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;