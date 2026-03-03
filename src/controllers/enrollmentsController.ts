import { Request, Response } from "express";
import {
  createEnrollment,
  deleteEnrollment,
  getAllEnrollments,
} from "../models/enrollments";

export async function listEnrollments(req: Request, res: Response) {
  try {
    const studentId =
      typeof req.query.student_id === "string"
        ? Number(req.query.student_id)
        : undefined;
    const courseId =
      typeof req.query.course_id === "string"
        ? Number(req.query.course_id)
        : undefined;

    const enrollments = await getAllEnrollments({
      student_id: studentId ?? undefined,
      course_id: courseId ?? undefined,
    });

    res.json({ data: enrollments, error: null });
  } catch (err: any) {
    res.status(500).json({ data: null, error: { message: err.message } });
  }
}

export async function createEnrollmentHandler(req: Request, res: Response) {
  try {
    const { student_id, course_id, semester, grade } = req.body;
    if (!student_id || !course_id || !semester) {
      return res
        .status(400)
        .json({ data: null, error: { message: "Missing required fields" } });
    }

    const enrollment = await createEnrollment({
      student_id: Number(student_id),
      course_id: Number(course_id),
      semester,
      grade: grade ?? null,
    });

    res.status(201).json({ data: enrollment, error: null });
  } catch (err: any) {
    if (err.message.includes("Enrollment already exists")) {
      return res.status(409).json({ data: null, error: { message: err.message } });
    }
    res.status(500).json({ data: null, error: { message: err.message } });
  }
}

export async function deleteEnrollmentHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteEnrollment(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ data: null, error: { message: "Enrollment not found" } });
    }
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ data: null, error: { message: err.message } });
  }
}

