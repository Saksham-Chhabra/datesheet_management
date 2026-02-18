import express from "express";
const router = express.Router();

import {
  createYear,
  getAllYears,
  deleteYear,
  updateYear,
} from "../controller/year.controller.js";

// fetch all years!
router.get("/", getAllYears);
// Create a new year
router.post("/", createYear);
router.delete("/:id", deleteYear);
router.put("/:id", updateYear);

export default router;
