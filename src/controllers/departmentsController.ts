import { Request, Response } from "express";
import { getAllDepartments, getDepartmentById } from "../models/departments";

export async function listDepartments(_req: Request, res: Response) {
  try {
    const departments = await getAllDepartments();
    res.json({ data: departments, error: null });
  } catch (err: any) {
    res.status(500).json({ data: null, error: { message: err.message } });
  }
}

export async function getDepartment(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const department = await getDepartmentById(id);
    if (!department) {
      return res
        .status(404)
        .json({ data: null, error: { message: "Department not found" } });
    }
    res.json({ data: department, error: null });
  } catch (err: any) {
    res.status(500).json({ data: null, error: { message: err.message } });
  }
}

