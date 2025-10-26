const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: function () {
        return this.isNew; // ✅ only required for new users
      },
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    goal: { type: String, enum: ["lose", "gain", "maintain"], required: true },
    age: { type: Number, required: true },
    trainingLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    expectedWeight: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
