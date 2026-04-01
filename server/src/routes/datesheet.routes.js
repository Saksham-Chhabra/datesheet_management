import express from "express";
import {
  createDateSheet,
  deleteDateSheet,
  generateDateSheet,
  getAllDateSheets,
  getDateSheetById,
  getDateSheetsByExam,
  getMyDateSheets,
  getDateSheetsBySubject,
  updateDateSheet,
} from "../controller/datesheet.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllDateSheets);
router.get("/my", authenticate, getMyDateSheets);
router.get("/exam/:examId", getDateSheetsByExam);
router.get("/subject/:subjectId", getDateSheetsBySubject);
router.get("/:id", getDateSheetById);
router.post("/", createDateSheet);
router.post("/generate", generateDateSheet);
router.post("/generate/:examId", generateDateSheet);
router.put("/:id", updateDateSheet);
router.delete("/:id", deleteDateSheet);

export default router;
