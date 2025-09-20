import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not set in .env");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Schema & Model
const professorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  about: String,
  research: String,
  publications: String,
  courses: String,
  contact: String,
  image: String // optional image URL
});

const Professor = mongoose.model("Professor", professorSchema);

// Routes

// Get all professors or search by name
// For example: /professors?search=John
app.get("/professors", async (req, res) => {
  try {
    const { search } = req.query;
    let profs;

    if (search) {
      // If a search query exists, perform a case-insensitive search
      // across name, research, and publications.
      // This is a more robust search.
      profs = await Professor.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { research: { $regex: search, $options: "i" } },
          { publications: { $regex: search, $options: "i" } },
        ]
      });
    } else {
      // If no search query, return all professors
      profs = await Professor.find();
    }

    res.json(profs);
  } catch (err) {
    res.status(500).json({ error: "Error fetching or searching professors" });
  }
});

// Add a professor
app.post("/professors", async (req, res) => {
  try {
    const newProf = new Professor(req.body);
    await newProf.save();
    res.status(201).json(newProf);
  } catch (err) {
    res.status(400).json({ error: "Failed to add professor", details: err });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("✅ Faculty API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));