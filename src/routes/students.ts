import { Router } from "express";
import {
  createStudentHandler,
  deleteStudentHandler,
  getStudent,
  listStudents,
  updateStudentHandler,
} from "../controllers/studentsController";

export const router = Router();

router.get("/", listStudents);
router.get("/:id", getStudent);
router.post("/", createStudentHandler);
router.put("/:id", updateStudentHandler);
router.delete("/:id", deleteStudentHandler);

