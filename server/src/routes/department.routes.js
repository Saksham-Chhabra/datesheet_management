// create route for department

import express from "express";
import Department from "../models/Department.js";
import { createDepartment } from "../controller/department.controller.js";

const router = express.Router();

// Create a new department
router.post("/", createDepartment);

export default router;
