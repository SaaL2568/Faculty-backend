import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS to allow your GitHub Pages domain
const corsOptions = {
  origin: 'https://saal2568.github.io', // <-- Remove /faculty-frontend
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
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

const Professor = mongoose.model("professors", professorSchema);

// Routes
// Debug route to show current database and collections
app.get("/debug", async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({ db: mongoose.connection.db.databaseName, collections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all professors or search by name
app.get("/professors", async (req, res) => {
  try {
    const { search } = req.query;
    let profs;

    if (search) {
      profs = await Professor.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { research: { $regex: search, $options: "i" } },
          { publications: { $regex: search, $options: "i" } },
        ]
      });
    } else {
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