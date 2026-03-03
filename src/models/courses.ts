import { pool } from "../config/db";

export interface Course {
  id?: number;
  code: string;
  title: string;
  department_id: number;
  credits: number;
}

export async function getAllCourses() {
  const [rows] = await pool.query("SELECT * FROM courses");
  return rows;
}

export async function getCourseById(id: number) {
  const [rows] = await pool.query("SELECT * FROM courses WHERE id = ?", [id]);
  const [course] = rows as any[];
  return course || null;
}

export async function createCourse(course: Course) {
  const { code, title, department_id, credits } = course;
  const [result] = await pool.query(
    "INSERT INTO courses (code, title, department_id, credits) VALUES (?, ?, ?, ?)",
    [code, title, department_id, credits]
  );
  const insertResult = result as { insertId: number };
  return getCourseById(insertResult.insertId);
}

export async function updateCourse(id: number, course: Partial<Course>) {
  const existing = await getCourseById(id);
  if (!existing) {
    return null;
  }

  const updated = {
    ...existing,
    ...course,
  };

  const { code, title, department_id, credits } = updated;

  await pool.query(
    "UPDATE courses SET code = ?, title = ?, department_id = ?, credits = ? WHERE id = ?",
    [code, title, department_id, credits, id]
  );

  return getCourseById(id);
}

export async function deleteCourse(id: number) {
  const [result] = await pool.query("DELETE FROM courses WHERE id = ?", [id]);
  const info = result as { affectedRows: number };
  return info.affectedRows > 0;
}

