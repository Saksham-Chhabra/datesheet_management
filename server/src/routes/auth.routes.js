import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  updateMyAcademicProfile,
  updateUserRole,
} from "../controller/authController.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/update-role", updateUserRole);
router.get("/me", authenticate, getMe);
router.put("/my-academic-profile", authenticate, updateMyAcademicProfile);

export default router;
