import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Task from "../models/Task.js";
import Learner from "../models/Learner.js";

const router = express.Router();


const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};


router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    const isHardcoded =
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD;

    if (isHardcoded) {
      const token = jwt.sign(
        { username, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.json({
        message: "Admin login successful",
        token,
        admin: { username, role: "admin" },
      });
    }

    
    const user = await User.findOne({ username });
    if (!user || user.role !== "admin" || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      message: "Admin login successful",
      token,
      admin: { username: user.username, role: "admin" },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


router.get("/stats", adminAuth, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });

    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeStudents = await User.countDocuments({
      role: "student",
      updatedAt: { $gte: since24h },
    });

    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "Completed" });

    res.json({ totalStudents, activeStudents, totalTasks, completedTasks });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.get("/students", adminAuth, async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/students/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Student not found" });
    const learner = await Learner.findOne({ learnerId: req.params.id });
    res.json({ user, learner });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.post("/students", adminAuth, async (req, res) => {
  try {
    const { username, email, password, studentId } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });
    const newUser = new User({ username, email, password, studentId, role: "student" });
    await newUser.save();
    res.status(201).json({ message: "Student created", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.put("/students/:id", adminAuth, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student updated", user: updated });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.delete("/students/:id", adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ learnerId: req.params.id });
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.get("/tasks", adminAuth, async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/tasks", adminAuth, async (req, res) => {
  try {
    const { title, subject, deadline, status, learnerId } = req.body;
    const task = new Task({ title, subject, deadline, status: status || "Pending", learnerId });
    await task.save();
    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.put("/tasks/:id", adminAuth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.delete("/tasks/:id", adminAuth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
