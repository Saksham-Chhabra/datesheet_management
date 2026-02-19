import express from "express";
const router = express.Router();

import {
  getAllSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
} from "../controller/semester.controller.js";

router.get("/", getAllSemesters);
router.post("/", createSemester);
router.put("/:id", updateSemester);
router.delete("/:id", deleteSemester);

export default router;
