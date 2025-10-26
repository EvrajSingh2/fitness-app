const express = require("express");
const FoodLog = require("../models/FoodLog");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// Add a new food log
router.post("/", verifyToken, async (req, res) => {
  try {
    const { logId, name, calories, protein, carbs, fats } = req.body;
    if (!logId || !name || !calories) {
      return res.status(400).json({ message: "Please provide logId, name, and calories" });
    }

    const foodLog = new FoodLog({
      logId,
      name,
      calories,
      protein: protein || 0,
      carbs: carbs || 0,
      fats: fats || 0,
    });

    const savedFood = await foodLog.save();
    res.status(201).json(savedFood);
  } catch (err) {
    console.error("Error adding food:", err);
    res.status(500).json({ message: "Error adding food" });
  }
});

// Get all food logs for a fitness log
router.get("/:logId", verifyToken, async (req, res) => {
  try {
    const foodLogs = await FoodLog.find({ logId: req.params.logId });
    res.status(200).json(foodLogs);
  } catch (err) {
    console.error("Error fetching food logs:", err);
    res.status(500).json({ message: "Error fetching food logs" });
  }
});

module.exports = router;
