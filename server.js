import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";  // ← import dotenv

dotenv.config(); // ← load .env variables

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;  // ← no hardcoded string

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Schema & Model
const professorSchema = new mongoose.Schema({
  name: String,
  about: String,
  research: String,
  publications: String,
  courses: String,
  contact: String,
  image: String // URL or relative path to image
});


const Professor = mongoose.model("Professor", professorSchema);

// Routes
app.get("/professors", async (req, res) => {
  const profs = await Professor.find();
  res.json(profs);
});

app.post("/professors", async (req, res) => {
  const newProf = new Professor(req.body);
  await newProf.save();
  res.json(newProf);
});

app.get("/professors/search/:name", async (req, res) => {
  const prof = await Professor.findOne({ name: req.params.name });
  res.json(prof || {});
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
