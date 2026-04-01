import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Branch from "../models/Branch.js";
import Semester from "../models/Semester.js";
import StudentProfile from "../models/StudentProfile.js";

// helper function
function isCollegeEmail(email) {
  const allowedDomainsStr = process.env.ALLOWED_DOMAINS || "nith.ac.in";
  const allowedDomains = allowedDomainsStr.split(",").map((d) => d.trim());
  const domain = email.split("@")[1];
  return allowedDomains.includes(domain);
}

// ================= REGISTER =================
export async function register(req, res) {
  try {
    console.log("Register request received with body:", req.body);

    let { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    email = email.toLowerCase().trim();
    console.log("Checking if email is college email:", email);

    if (!isCollegeEmail(email)) {
      return res
        .status(400)
        .json({ message: "Use college email only (@nith.ac.in)" });
    }

    console.log("Checking if user already exists...");
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating new user...");
    const user = await User.create({
      email,
      password: hashedPassword,
    });
    console.log("User saved successfully");

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: err.message || "Registration failed" });
  }
}

// ================= LOGIN =================
export async function login(req, res) {
  try {
    console.log("Login request received");
    let { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    email = email.toLowerCase().trim();

    if (!isCollegeEmail(email)) {
      return res.status(400).json({ message: "Invalid college email" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.json({ message: "Logged in successfully", role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message || "Login failed" });
  }
}

// ================= LOGOUT =================
export async function logout(req, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
}

// ================= UPDATE USER ROLE =================
export async function updateUserRole(req, res) {
  try {
    console.log("Update user role request received:", req.body);
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required" });
    }

    if (!["student", "admin"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Role must be either 'student' or 'admin'" });
    }

    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ role });

    console.log(`User ${email} role updated to ${role}`);
    res.json({ message: `User role updated to ${role}`, user });
  } catch (err) {
    console.error("Update user role error:", err);
    res.status(500).json({ message: err.message || "Update failed" });
  }
}

export async function getMe(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const user = await User.findByPk(userId, {
      attributes: ["user_id", "email", "role"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await StudentProfile.findOne({
      where: { user_id: userId },
      attributes: ["branch_id", "semester_id"],
    });

    return res.status(200).json({
      user,
      profile,
    });
  } catch (err) {
    console.error("Get me error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Failed to fetch user" });
  }
}

export async function updateMyAcademicProfile(req, res) {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { branch_id, semester_id } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    if (userRole !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can set academic profile" });
    }

    if (!branch_id || !semester_id) {
      return res
        .status(400)
        .json({ message: "branch_id and semester_id are required" });
    }

    const [branch, semester] = await Promise.all([
      Branch.findByPk(branch_id),
      Semester.findByPk(semester_id),
    ]);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    const existing = await StudentProfile.findOne({
      where: { user_id: userId },
    });

    if (existing) {
      await existing.update({ branch_id, semester_id });
    } else {
      await StudentProfile.create({ user_id: userId, branch_id, semester_id });
    }

    const profile = await StudentProfile.findOne({
      where: { user_id: userId },
      attributes: ["branch_id", "semester_id"],
    });

    return res.status(200).json({
      message: "Academic profile updated successfully",
      profile,
    });
  } catch (err) {
    console.error("Update academic profile error:", err);
    return res.status(500).json({ message: err.message || "Update failed" });
  }
}
