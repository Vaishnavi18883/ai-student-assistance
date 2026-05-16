import express from "express";

const router = express.Router();


// Register Route

router.post("/register", (req, res) => {

  const {
    username,
    email,
    password,
    studentId
  } = req.body;

  // Validation

  if (
    !username ||
    !email ||
    !password ||
    !studentId
  ) {

    return res.status(400).json({
      message: "All fields are required"
    });

  }

  res.json({

    message: "Registration Successful",

    user: {
      username,
      email,
      studentId,
      role: "student"
    }

  });

});


// Login Route

router.post("/login", (req, res) => {

  const { email, password } = req.body;

  // Validation

  if (!email || !password) {

    return res.status(400).json({
      message: "All fields are required"
    });

  }

  res.json({

    message: "Login Successful",

    user: {
      email,
      role: "student"
    }

  });

});

export default router;