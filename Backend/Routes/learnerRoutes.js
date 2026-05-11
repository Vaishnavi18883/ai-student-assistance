import express from "express";

const router = express.Router();

router.post("/add", (req, res) => {

  const learnerData = req.body;

  res.json({
    message: "Learner Profile Saved",
    data: learnerData
  });

});

export default router;