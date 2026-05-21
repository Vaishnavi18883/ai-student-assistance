import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";  

const router = express.Router();


router.post("/register", async (req, res) => {

  try {

    const {
      username,
      email,
      password,
      studentId
    } = req.body;


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


    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message: "User already exists"
      });

    }

    const newUser = new User({

      username,
      email,
      password,
      studentId,
      role: "student"

    });


    await newUser.save();

    res.status(201).json({

      message: "Registration Successful",

      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        studentId: newUser.studentId,
        role: newUser.role
      }

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
  console.log("BODY RECEIVED:", req.body);

});


router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: "Invalid Password"
      });
    }

  
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,             
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        studentId: user.studentId,
        role: user.role
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }

});

export default router;