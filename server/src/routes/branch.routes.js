import express from "express";
const router = express.Router();

import {
  createBranch,
  getAllBranches,
  deleteBranch,
  updateBranch,
} from "../controller/branch.controller.js";

// fetch all branches!

router.get("/", getAllBranches);
// Create a new branch
router.post("/", createBranch);
router.delete("/:id", deleteBranch);
router.put("/:id", updateBranch);

export default router;
