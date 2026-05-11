import express from "express";

const router = express.Router();

router.post("/register", (req, res) => {

  const { name, email } = req.body;

  res.json({
    message: "Registration Successful",
    user: {
      name,
      email
    }
  });

});


router.post("/login", (req, res) => {

  const { email } = req.body;

  res.json({
    message: "Login Successful",
    user: {
      email
    }
  });

});

export default router;