import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import authRouter from "./Routes/authRoutes.js";
import taskRouter from "./Routes/taskRoute.js";       
import learnerRouter from "./Routes/learnerRoutes.js"; 
import materialRoutes from "./Routes/materialRoute.js";
import adminRouter from "./Routes/adminRoutes.js";
import Chat from "./models/aiChat.js";                

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Server working");
});

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);        
app.use("/api/learner", learnerRouter); 
app.use("/api/materials", materialRoutes); 
app.use("/api/admin", adminRouter);

app.post("/api/chat", async (req, res) => {
  try {
    const { message, learnerId } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    // Save chat in DB
    const newChat = new Chat({
      learnerId,
      question: message,
      answer: reply
    });
    await newChat.save();

    res.json({ reply });

  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});

//  chat history
app.get("/api/chat/history/:learnerId", async (req, res) => {
  try {
    const chats = await Chat.find({
      learnerId: req.params.learnerId
    });
    res.json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(5000, () => {
  console.log("Server running on 5000");
});