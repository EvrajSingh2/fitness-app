const mongoose = require("mongoose");

const FitnessLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weight: { type: Number, required: true },
  caloriesBurned: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FitnessLog", FitnessLogSchema);
