// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ------------------- REGISTER -------------------
router.post("/register", async (req, res) => {
  const { emailOrMobile, password } = req.body;

  // Validate required fields
  if (!emailOrMobile || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ emailOrMobile });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Create new user
    const newUser = new User({ emailOrMobile, password });
    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- LOGIN -------------------
router.post("/login", async (req, res) => {
  const { emailOrMobile, password } = req.body;

  if (!emailOrMobile || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const user = await User.findOne({ emailOrMobile });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
