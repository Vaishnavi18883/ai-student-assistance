import express from "express";
import Task from "../models/Task.js";  

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();             
    res.json({
      message: "Task Added Successfully",
      task: newTask
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();   
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );                                
    res.json({
      message: "Task Updated",
      task: updated
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id); 
    res.json({ message: "Task Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;