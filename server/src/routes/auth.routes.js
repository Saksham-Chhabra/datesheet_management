import express from "express";
import {
  register,
  login,
  logout,
  updateUserRole,
} from "../controller/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/update-role", updateUserRole);

export default router;
