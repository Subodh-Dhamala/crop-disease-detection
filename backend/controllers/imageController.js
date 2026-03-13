const Image = require("../models/Images.js");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const FASTAPI_URL = process.env.FASTAPI_URL || "https://subodhdhamala-greenbidu.hf.space";

const getImages = async (req, res) => {
  try {
    const userId = req.user.id;
    const images = await Image.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload image and call ML API
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id;
    if (!userId)
      return res.status(401).json({ message: "User Id is required" });

    // Store data in DB with pending status
    const image = await Image.create({
      user: userId,
      imageUrl: req.file.path,
      diseaseDetected: "pending",
    });

    // Call FastAPI ML API in background
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));

    try {
      console.log(`Calling ML API: ${FASTAPI_URL}/predict/`);

      const response = await axios.post(
        `${FASTAPI_URL}/predict/`,
        form,
        {
          headers: form.getHeaders(),
          timeout: 60000,
        }
      );

      const mlResult = response.data;
      console.log("ML Result:", mlResult);

      // Update image with ML results
      await Image.findByIdAndUpdate(image._id, {
        diseaseDetected: mlResult.disease || "Unknown",
        confidence: mlResult.confidence,
        advisory: mlResult.advisory,
      });

      console.log(`Image ${image._id} updated with ML results`);

      // Fetch updated image
      const updatedImage = await Image.findById(image._id);

      return res.status(200).json({
        message: "Image analyzed successfully",
        image: updatedImage,
      });

    } catch (mlError) {
      console.error("ML API Error:", mlError.message);

      return res.status(200).json({
        message: "Image uploaded, ML analysis failed",
        image,
        error: "ML service unavailable",
      });
    }

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete image
const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    if (!imageId)
      return res.status(404).json({ message: "Id params is required" });

    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    if (image.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    fs.unlink(image.imageUrl, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });

    await image.deleteOne();

    return res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getImages, uploadImage, deleteImage };