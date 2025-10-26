const express = require("express");
const User = require("../models/User");
const verifyToken = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 🧍‍♂️ Get user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
});


// Update profile
router.put("/profile", verifyToken, async (req, res) => {
  const {
    name,
    email,
    gender,
    weight,
    height,
    goal,
    age,
    trainingLevel,
    expectedWeight,
    oldPassword,
    newPassword,
  } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Handle password update
    if (newPassword) {
      if (!oldPassword)
        return res.status(400).json({ message: "Old password is required to change password" });

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // ✅ Update only provided fields (prevents accidental overwriting)
    if (name) user.name = name;
    if (email) user.email = email;
    if (gender) user.gender = gender;
    if (weight) user.weight = weight;
    if (height) user.height = height;
    if (goal) user.goal = goal;
    if (trainingLevel) user.trainingLevel = trainingLevel;
    if (expectedWeight) user.expectedWeight = expectedWeight;
    if (age) user.age = age;


    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        gender: user.gender,
        weight: user.weight,
        height: user.height,
        goal: user.goal,
        trainingLevel: user.trainingLevel,
        expectedWeight: user.expectedWeight,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// 🔐 Forgot Password (Simulated)
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // In real system, send email here
    res.json({ message: "Password reset link sent to your email (simulated)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
