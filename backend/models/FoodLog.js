const mongoose = require("mongoose");

const foodLogSchema = new mongoose.Schema({
  logId: { type: mongoose.Schema.Types.ObjectId, ref: "FitnessLog", required: true },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
});

module.exports = mongoose.model("FoodLog", foodLogSchema);
