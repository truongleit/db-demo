import { Request, Response } from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} from "../models/courses";

export async function listCourses(_req: Request, res: Response) {
  try {
    const courses = await getAllCourses();
    res.json({ data: courses, error: null });
  } catch (err: any) {
    res.status(500).json({ data: null, error: { message: err.message } });
  }
}

export async function getCourse(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const course = await getCourseById(id);
    if (!course) {
      return res.status(404).json({ data: null, error: { message: "Course not found" } });
    }
    res.json({ data: course, error: null });
  } catch (err: any) {
    res.status(500).json({ data: null, error: { message: err.message } });
  }
}

export async function createCourseHandler(req: Request, res: Response) {
  try {
    const { code, title, department_id, credits } = req.body;
    if (!code || !title || !department_id || !credits) {
      return res
        .status(400)
        .json({ data: null, error: { message: "Missing required fields" } });
    }
    const course = await createCourse({
      code,
      title,
      department_id: Number(department_id),
      credits: Number(credits),
    });
    res.status(201).json({ data: course, error: null });
  } catch (err: any) {
    res.status(500).json({ data: null, error: { message: err.message } });
  }
}

export async function updateCourseHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updated = await updateCourse(id, req.body);
    if (!updated) {
      return res.status(404).json({ data: null, error: { message: "Course not found" } });
    }
    res.json({ data: updated, error: null });
  } catch (err: any) {
    res.status(500).json({ data: null, error: { message: err.message } });
  }
}

export async function deleteCourseHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteCourse(id);
    if (!deleted) {
      return res.status(404).json({ data: null, error: { message: "Course not found" } });
    }
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ data: null, error: { message: err.message } });
  }
}

