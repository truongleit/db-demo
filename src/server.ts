import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import expressLayouts from "express-ejs-layouts";
import path from "path";

import { router as studentsRouter } from "./routes/students";
import { router as coursesRouter } from "./routes/courses";
import { router as departmentsRouter } from "./routes/departments";
import { router as enrollmentsRouter } from "./routes/enrollments";
import { webStudentsRouter } from "./routes/web/students";
import { webCoursesRouter } from "./routes/web/courses";
import { webDepartmentsRouter } from "./routes/web/departments";
import { webEnrollmentsRouter } from "./routes/web/enrollments";

dotenv.config();

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS and logging
app.use(
  cors({
    origin: corsOrigin,
  })
);
app.use(morgan("dev"));

// View engine, layouts, and static files for minimal frontend
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.set("layout", "layout");
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "..", "public")));

// Minimal HTML frontend routes
app.use("/students", webStudentsRouter);
app.use("/courses", webCoursesRouter);
app.use("/departments", webDepartmentsRouter);
app.use("/enrollments", webEnrollmentsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ data: { status: "ok" }, error: null });
});

app.use("/api/students", studentsRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/departments", departmentsRouter);
app.use("/api/enrollments", enrollmentsRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});

