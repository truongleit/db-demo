import { Router } from "express";
import {
  createEnrollmentHandler,
  deleteEnrollmentHandler,
  listEnrollments,
} from "../controllers/enrollmentsController";

export const router = Router();

router.get("/", listEnrollments);
router.post("/", createEnrollmentHandler);
router.delete("/:id", deleteEnrollmentHandler);

