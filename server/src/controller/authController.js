import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
