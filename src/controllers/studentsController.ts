import { Request, Response } from "express";
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
} from "../models/students";

export async function listStudents(req: Request, res: Response) {
  try {
    const departmentId = req.query.department_id
      ? Number(req.query.department_id)
      : undefined;
    const students = await getAllStudents(departmentId);
    res.json({ data: students, error: null });
  } catch (err: any) {
    res.status(500).json({ data: null, error: { message: err.message } });
  }
}

export async function getStudent(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const student = await getStudentById(id);
    if (!student) {
      return res.status(404).json({ data: null, error: { message: "Student not found" } });
    }
    res.json({ data: student, error: null });
  } catch (err: any) {
    res.status(500).json({ data: null, error: { message: err.message } });
  }
}

export async function createStudentHandler(req: Request, res: Response) {
  try {
    const { first_name, last_name, email, department_id, enrollment_year } =
      req.body;
    if (
      !first_name ||
      !last_name ||
      !email ||
      !department_id ||
      !enrollment_year
    ) {
      return res
        .status(400)
        .json({ data: null, error: { message: "Missing required fields" } });
    }

    const student = await createStudent({
      first_name,
      last_name,
      email,
      department_id: Number(department_id),
      enrollment_year: Number(enrollment_year),
    });

    res.status(201).json({ data: student, error: null });
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ data: null, error: { message: "Email already exists" } });
    }
    res.status(500).json({ data: null, error: { message: err.message } });
  }
}

export async function updateStudentHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updated = await updateStudent(id, req.body);
    if (!updated) {
      return res.status(404).json({ data: null, error: { message: "Student not found" } });
    }
    res.json({ data: updated, error: null });
  } catch (err: any) {
    res.status(500).json({ data: null, error: { message: err.message } });
  }
}

export async function deleteStudentHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteStudent(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ data: null, error: { message: "Student not found" } });
    }
    res.status(204).send();
  } catch (err: any) {
    if (err.message.includes("existing enrollments")) {
      return res.status(409).json({
        data: null,
        error: { message: "Cannot delete student with existing enrollments" },
      });
    }
    res.status(500).json({ data: null, error: { message: err.message } });
  }
}

