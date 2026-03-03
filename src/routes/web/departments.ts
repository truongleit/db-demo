import { Router } from "express";
import { getAllDepartments } from "../../models/departments";

export const webDepartmentsRouter = Router();

webDepartmentsRouter.get("/", async (_req, res) => {
  const departments = await getAllDepartments();
  res.render("departments/index", { departments });
});

