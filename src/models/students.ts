import { pool } from "../config/db";

export interface Student {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  department_id: number;
  enrollment_year: number;
}

export async function getAllStudents(departmentId?: number) {
  if (departmentId) {
    const [rows] = await pool.query(
      "SELECT * FROM students WHERE department_id = ?",
      [departmentId]
    );
    return rows;
  }

  const [rows] = await pool.query("SELECT * FROM students");
  return rows;
}

export async function getStudentById(id: number) {
  const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [id]);
  const [student] = rows as any[];
  return student || null;
}

export async function createStudent(student: Student) {
  const { first_name, last_name, email, department_id, enrollment_year } =
    student;
  const [result] = await pool.query(
    "INSERT INTO students (first_name, last_name, email, department_id, enrollment_year) VALUES (?, ?, ?, ?, ?)",
    [first_name, last_name, email, department_id, enrollment_year]
  );
  const insertResult = result as { insertId: number };
  return getStudentById(insertResult.insertId);
}

export async function updateStudent(id: number, student: Partial<Student>) {
  const existing = await getStudentById(id);
  if (!existing) {
    return null;
  }

  const updated = {
    ...existing,
    ...student,
  };

  const { first_name, last_name, email, department_id, enrollment_year } =
    updated;

  await pool.query(
    "UPDATE students SET first_name = ?, last_name = ?, email = ?, department_id = ?, enrollment_year = ? WHERE id = ?",
    [first_name, last_name, email, department_id, enrollment_year, id]
  );

  return getStudentById(id);
}

export async function deleteStudent(id: number) {
  const [enrollmentRows] = await pool.query(
    "SELECT id FROM enrollments WHERE student_id = ? LIMIT 1",
    [id]
  );
  const enrollments = enrollmentRows as any[];
  if (enrollments.length > 0) {
    throw new Error("Cannot delete student with existing enrollments");
  }

  const [result] = await pool.query("DELETE FROM students WHERE id = ?", [id]);
  const info = result as { affectedRows: number };
  return info.affectedRows > 0;
}

