require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const foodRouter = require("./routes/food");

// Routes
const authRoutes = require("./routes/auth");
const logsRoute = require("./routes/logs");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/food", foodRouter);

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/logs", logsRoute);

// Test route
app.get("/", (req, res) => {
  res.send("Fitness App backend is running 🚀");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err.message));

// Start server
const PORT = process.env.PORT || 5000;
const path = require("path");

// Serve frontend (React) in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

