import express from "express";
import Learner from "../models/Learner.js";  

const router = express.Router();


router.post("/add", async (req, res) => {
  try {
    const { learnerId, rollNo } = req.body;
  
    let learner = await Learner.findOne({ 
      $or: [
        { learnerId: learnerId || "NOT_SET" }, 
        { rollNo: rollNo || "NOT_SET" }
      ] 
    });

    if (learner) {
      learner = await Learner.findOneAndUpdate({ _id: learner._id }, req.body, { new: true });
      return res.json({
        message: "Learner Profile Updated Successfully",
        learner
      });
    } else {
      const newLearner = new Learner(req.body);
      await newLearner.save();                 
      return res.json({
        message: "Learner Profile Saved Successfully",
        learner: newLearner
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/:learnerId", async (req, res) => {
  try {
    const learner = await Learner.findOne({
      learnerId: req.params.learnerId
    });                                       
    res.json(learner);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const learners = await Learner.find();    
    res.json(learners);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;