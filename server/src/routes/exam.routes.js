import express from "express";
import {
  createExam,
  deleteExam,
  getAllExams,
  getExamById,
  getExamsByAcademicYear,
  getExamsByType,
  updateExam,
} from "../controller/exam.controller.js";

const router = express.Router();

router.get("/", getAllExams);
router.get("/type/:examType", getExamsByType);
router.get("/year/:academicYear", getExamsByAcademicYear);
router.get("/:id", getExamById);
router.post("/", createExam);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

export default router;
