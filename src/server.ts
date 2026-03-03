import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import { router as studentsRouter } from "./routes/students";
import { router as coursesRouter } from "./routes/courses";
import { router as departmentsRouter } from "./routes/departments";
import { router as enrollmentsRouter } from "./routes/enrollments";

dotenv.config();

const app = express();

app.use(express.json());

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: corsOrigin,
  })
);

app.use(morgan("dev"));

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

