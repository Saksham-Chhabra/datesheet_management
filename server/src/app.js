import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import deprtmentRoutes from "./routes/department.routes.js";
import degreeRoutes from "./routes/degree.routes.js";
import branchRoutes from "./routes/branch.routes.js";
import yearRoutes from "./routes/year.routes.js";
import semesterRoutes from "./routes/semester.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes here :
app.use("/api/departments", deprtmentRoutes);
app.use("/api/degrees", degreeRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/years", yearRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/subjects", subjectRoutes);

export { app };
