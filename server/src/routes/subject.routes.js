import express from "express";
const router = express.Router();
import {
  createSubject,
  getAllSubjects,
  deleteSubject,
  updateSubject,
} from "../controller/subject.controller.js";

// fetch all subjects!
router.get("/", getAllSubjects);
// Create a new subject
router.post("/", createSubject);
router.delete("/:id", deleteSubject);
router.put("/:id", updateSubject);

export default router;
