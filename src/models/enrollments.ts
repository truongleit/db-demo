import { pool } from "../config/db";

export interface Enrollment {
  id?: number;
  student_id: number;
  course_id: number;
  semester: string;
  grade?: string | null;
}

export async function getAllEnrollmentsWithDetails(filters?: {
  student_id?: number;
  course_id?: number;
}) {
  let sql = `
    SELECT 
      e.*,
      CONCAT(s.first_name, ' ', s.last_name) AS student_name,
      s.email AS student_email,
      c.code AS course_code,
      c.title AS course_title
    FROM enrollments e
    JOIN students s ON e.student_id = s.id
    JOIN courses c ON e.course_id = c.id
    WHERE 1=1
  `;
  const params: Array<number> = [];

  if (filters?.student_id) {
    sql += " AND e.student_id = ?";
    params.push(filters.student_id);
  }

  if (filters?.course_id) {
    sql += " AND e.course_id = ?";
    params.push(filters.course_id);
  }

  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function getAllEnrollments(
  filters?: { student_id?: number | undefined; course_id?: number | undefined }
) {
  let sql = "SELECT * FROM enrollments WHERE 1=1";
  const params: Array<number> = [];

  if (filters?.student_id) {
    sql += " AND student_id = ?";
    params.push(filters.student_id);
  }

  if (filters?.course_id) {
    sql += " AND course_id = ?";
    params.push(filters.course_id);
  }

  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function createEnrollment(enrollment: Enrollment) {
  const { student_id, course_id, semester, grade = null } = enrollment;

  const [existing] = await pool.query(
    "SELECT id FROM enrollments WHERE student_id = ? AND course_id = ? AND semester = ?",
    [student_id, course_id, semester]
  );

  const existingRows = existing as any[];
  if (existingRows.length > 0) {
    throw new Error("Enrollment already exists for this student, course and semester");
  }

  const [result] = await pool.query(
    "INSERT INTO enrollments (student_id, course_id, semester, grade) VALUES (?, ?, ?, ?)",
    [student_id, course_id, semester, grade]
  );

  const insertResult = result as { insertId: number };
  return getEnrollmentById(insertResult.insertId);
}

export async function getEnrollmentById(id: number) {
  const [rows] = await pool.query("SELECT * FROM enrollments WHERE id = ?", [
    id,
  ]);
  const [enrollment] = rows as any[];
  return enrollment || null;
}

export async function deleteEnrollment(id: number) {
  const [result] = await pool.query("DELETE FROM enrollments WHERE id = ?", [
    id,
  ]);
  const info = result as { affectedRows: number };
  return info.affectedRows > 0;
}

