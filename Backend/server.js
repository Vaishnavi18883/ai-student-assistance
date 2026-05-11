import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// ---------------- HOME ROUTE ----------------

app.get("/", (req, res) => {
  res.send("Server working");
});


// ---------------- AUTH API ----------------

// Register API

app.post("/api/auth/register", (req, res) => {

  const { name, email, password } = req.body;

  res.json({
    message: "Registration Successful",
    user: {
      name,
      email
    }
  });

});


// Login API

app.post("/api/auth/login", (req, res) => {

  const { email, password } = req.body;

  res.json({
    message: "Login Successful",
    user: {
      email
    }
  });

});


// ---------------- LEARNER PROFILE API ----------------

app.post("/api/learner/add", (req, res) => {

  const learnerData = req.body;

  res.json({
    message: "Learner Profile Saved",
    learner: learnerData
  });

});


// ---------------- TASK MANAGER API ----------------

// Add Task

app.post("/api/tasks/add", (req, res) => {

  const task = req.body;

  res.json({
    message: "Task Added",
    task
  });

});


// Get Tasks

app.get("/api/tasks", (req, res) => {

  res.json([
    {
      id: 1,
      title: "Complete React Project"
    },
    {
      id: 2,
      title: "Study Node.js"
    }
  ]);

});


// ---------------- AI CHAT API ----------------

app.post("/api/chat", async (req, res) => {

  try {

    const { message } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct",

        messages: [
          {
            role: "user",
            content: message
          }
        ],
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply =
      response.data.choices[0].message.content;

    res.json({ reply });

  }

  catch (error) {

    console.error(
      "ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: error.response?.data || error.message,
    });

  }

});


// ---------------- SERVER ----------------

app.listen(5000, () => {
  console.log("Server running on 5000");
});