const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register user / OAuth fallback
router.post("/users", async (req, res) => {
  try {
    const { email, name, role, password } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }
    const newUser = new User({
      email: email.toLowerCase(),
      name,
      role: role || "USER",
      password: password || "delhi123"
    });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Google OAuth verification and registration/login
router.post("/auth/google", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    if (!email) {
      return res.status(400).json({ error: "Email not verified in Google token" });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      let role = "USER";
      if (email.toLowerCase() === "admin@projectdelhi.org") {
        role = "ADMIN";
      } else if (
        [
          "rahul@projectdelhi.org",
          "priya@projectdelhi.org",
          "raghav@projectdelhi.org",
        ].includes(email.toLowerCase())
      ) {
        role = "MODERATOR";
      }

      user = new User({
        email: email.toLowerCase(),
        name: name || email.split("@")[0],
        role,
        password: "delhi123"
      });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(401).json({ error: "Invalid Google token" });
  }
});

// Email/password login
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

