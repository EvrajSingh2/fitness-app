const express = require("express");
const FitnessLog = require("../models/FitnessLog");
const FoodLog = require("../models/FoodLog");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// Add fitness log
router.post("/", verifyToken, async (req, res) => {
  try {
    const log = new FitnessLog({ userId: req.user.id, ...req.body });
    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get logs with food logs
router.get("/", verifyToken, async (req, res) => {
  try {
    const logs = await FitnessLog.find({ userId: req.user.id }).sort({ date: 1 });

    const logsWithFood = await Promise.all(
      logs.map(async (log) => {
        const foodLogs = await FoodLog.find({ logId: log._id });
        return {
          _id: log._id,
          date: log.date,
          weight: log.weight,
          caloriesBurned: log.caloriesBurned,
          foodLogs: foodLogs.map(f => ({
            id: f._id,
            name: f.name,
            calories: f.calories,
            protein: f.protein,
            carbs: f.carbs,
            fats: f.fats
          }))
        };
      })
    );

    res.status(200).json(logsWithFood);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ message: "Error fetching food logs" });
  }
});

module.exports = router;
