import express from "express";

const router = express.Router();

router.post("/add", (req, res) => {

  const {
    name,
    rollNo,
    course,
    department,
    semester,
    phone
  } = req.body;

  // Validation

  if (
    !name ||
    !rollNo ||
    !course ||
    !department ||
    !semester ||
    !phone
  ) {

    return res.status(400).json({
      message: "All fields are required"
    });

  }

  res.json({

    message: "Learner Profile Saved Successfully",

    learner: {
      name,
      rollNo,
      course,
      department,
      semester,
      phone
    }

  });

});

export default router;