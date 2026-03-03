import { Router } from "express";
import {
  createCourseHandler,
  deleteCourseHandler,
  getCourse,
  listCourses,
  updateCourseHandler,
} from "../controllers/coursesController";

export const router = Router();

router.get("/", listCourses);
router.get("/:id", getCourse);
router.post("/", createCourseHandler);
router.put("/:id", updateCourseHandler);
router.delete("/:id", deleteCourseHandler);

