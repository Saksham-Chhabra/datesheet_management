import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import departmentRoutes from "./routes/department.routes.js";
import degreeRoutes from "./routes/degree.routes.js";
import branchRoutes from "./routes/branch.routes.js";
import yearRoutes from "./routes/year.routes.js";
import semesterRoutes from "./routes/semester.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import authRoutes from "./routes/auth.routes.js";
import examRoutes from "./routes/exam.routes.js";
import timeSlotRoutes from "./routes/timeslot.routes.js";
import dateSheetRoutes from "./routes/datesheet.routes.js";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server requests with no Origin header.
    if (!origin) return callback(null, true);

    // If '*' is configured, reflect request origin to support credentials.
    if (allowedOrigins.includes("*")) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Health check endpoints
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));
app.get("/ready", (req, res) => res.status(200).json({ status: "Ready" }));

// routes here :
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/degrees", degreeRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/years", yearRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/timeslots", timeSlotRoutes);
app.use("/api/datesheets", dateSheetRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

export { app };
