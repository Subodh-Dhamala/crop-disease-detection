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
      type: mongoose.Schema.Types.Mixed,  //Accepts any structure - both old and new
      default: {}
    }
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;