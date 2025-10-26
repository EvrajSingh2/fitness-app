import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], default: "male" },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  goal: { type: String, enum: ["lose", "gain", "explore"], default: "explore" },
  trainingLevel: { type: String, enum: ["beginner","moderate","high"], default: "moderate" },
  activity: { type: String, default: "general" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("UserProfile", UserProfileSchema);
