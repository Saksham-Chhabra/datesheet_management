// create route for department

import express from "express";
import {
  createDegree,
  getAllDegrees,
  deleteDegree,
  updateDegree,
} from "../controller/degree.controller.js";

const router = express.Router();

// fetch all degrees!

router.get("/", getAllDegrees);

// Create a new degree
router.post("/", createDegree);

router.delete("/:id", deleteDegree);
router.put("/:id", updateDegree);

export default router;
