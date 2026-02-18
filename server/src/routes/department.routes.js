// create route for department

import express from "express";
import {
  createDepartment,
  getAllDepartments,
  deleteDepartment,
  updateDepartment,
} from "../controller/department.controller.js";

const router = express.Router();

// fetch all departments!

router.get("/", getAllDepartments);

// Create a new department
router.post("/", createDepartment);

router.delete("/:id", deleteDepartment);
router.put("/:id", updateDepartment);

export default router;
