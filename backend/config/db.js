const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI || MONGODB_URI.includes("YOUR_MONGODB_ATLAS_CONNECTION_STRING_HERE")) {
    console.error("Error: MONGODB_URI is not set correctly in your .env file!");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas successfully!");
  } catch (err) {
    console.error("Failed to connect to MongoDB Atlas:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
