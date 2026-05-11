import express from "express";

const router = express.Router();


// Dummy Tasks Array

let tasks = [];


// Add Task

router.post("/add", (req, res) => {

  const task = req.body;

  tasks.push(task);

  res.json({
    message: "Task Added Successfully",
    tasks
  });

});


// Get All Tasks

router.get("/", (req, res) => {

  res.json(tasks);

});


// Delete Task

router.delete("/:id", (req, res) => {

  const id = req.params.id;

  tasks = tasks.filter(
    (task, index) => index != id
  );

  res.json({
    message: "Task Deleted",
    tasks
  });

});

export default router;