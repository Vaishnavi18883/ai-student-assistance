import express from "express";
import StudyMaterial from "../models/studyMaterial.js";
import upload from "../middleware/upload.js";

const router = express.Router();




router.post(
  "/add",
  upload.single("pdf"),
  async (req, res) => {

    try {

      const {
        title,
        subject,
        description,
        studentId
      } = req.body;

      const newMaterial = new StudyMaterial({

        title,
        subject,
        description,
        studentId,

        fileUrl: req.file.path

      });

      await newMaterial.save();

      res.json({
        message: "Material Uploaded Successfully",
        material: newMaterial
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: error.message
      });

    }

  }
);



router.get("/:studentId", async (req, res) => {

  try {

    const materials =
      await StudyMaterial.find({

        studentId: req.params.studentId

      });

    res.json(materials);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});




router.delete("/:id", async (req, res) => {

  try {

    await StudyMaterial.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Material Deleted"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

export default router;