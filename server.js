const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // To load environment variables from a .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/catfinal"; // Ensure there are no spaces
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema for User
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 0 },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] }, // Add enum for gender
  section1Score: { type: Number, required: true, min: 0, max: 100 },
  section2Score: { type: Number, required: true, min: 0, max: 100 },
  section3Score: { type: Number, required: true, min: 0, max: 100 },
  overallPercentile: { type: Number, required: true, min: 0, max: 100 } // Add overallPercentile field
});

const User = mongoose.model("User", UserSchema);

// API route to handle welcome message
app.get('/', (req, res) => {
  res.send('Welcome to the CAT Scores API!');
});

// API route to save user data
app.post("/api/users", async (req, res) => {
  const { name, age, gender, section1Score, section2Score, section3Score, overallPercentile } = req.body;

  // Validation
  const scores = [section1Score, section2Score, section3Score, overallPercentile];
  const isValidScore = scores.every(score => score >= 0 && score <= 100);

  if (!isValidScore) {
    return res.status(400).json({ error: "Scores must be between 0 and 100." });
  }

  try {
    const newUser = new User({
      name,
      age,
      gender,
      section1Score,
      section2Score,
      section3Score,
      overallPercentile,
    });
    await newUser.save();
    res.status(201).json({ message: "User data saved!" });
  } catch (err) {
    console.error("Error saving user data:", err); // Log the error for debugging
    res.status(500).json({ error: "Failed to save user data" });
  }
});

// API route to fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json(users); // Send the users as JSON
  } catch (err) {
    console.error("Error fetching user data:", err); // Log the error for debugging
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
