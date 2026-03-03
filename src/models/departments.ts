import { pool } from "../config/db";

export interface Department {
  id?: number;
  name: string;
  code: string;
}

export async function getAllDepartments() {
  const [rows] = await pool.query("SELECT * FROM departments");
  return rows;
}

export async function getDepartmentById(id: number) {
  const [rows] = await pool.query("SELECT * FROM departments WHERE id = ?", [
    id,
  ]);
  const [department] = rows as any[];
  return department || null;
}

