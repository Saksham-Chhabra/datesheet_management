import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import departmentRoutes from "./routes/department.routes.js";
import degreeRoutes from "./routes/degree.routes.js";
import branchRoutes from "./routes/branch.routes.js";
import yearRoutes from "./routes/year.routes.js";
import semesterRoutes from "./routes/semester.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  })
);
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

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

export { app };
