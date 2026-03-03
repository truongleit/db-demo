import { Router } from "express";
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
} from "../../models/students";

export const webStudentsRouter = Router();

webStudentsRouter.get("/", async (req, res) => {
  const error = req.query.error as string | undefined;
  const students = await getAllStudents();
  res.render("students/index", { students, error });
});

webStudentsRouter.get("/new", (_req, res) => {
  res.render("students/new");
});

webStudentsRouter.post("/", async (req, res) => {
  const { first_name, last_name, email, department_id, enrollment_year } =
    req.body;
  if (
    !first_name ||
    !last_name ||
    !email ||
    !department_id ||
    !enrollment_year
  ) {
    return res.redirect("/students?error=Missing+required+fields");
  }

  try {
    await createStudent({
      first_name,
      last_name,
      email,
      department_id: Number(department_id),
      enrollment_year: Number(enrollment_year),
    });
    res.redirect("/students");
  } catch (err: any) {
    res.redirect(
      "/students?error=" + encodeURIComponent(err.message ?? "Failed to create")
    );
  }
});

webStudentsRouter.get("/:id/edit", async (req, res) => {
  const id = Number(req.params.id);
  const student = await getStudentById(id);
  if (!student) {
    return res.redirect("/students?error=Student+not+found");
  }
  res.render("students/edit", { student });
});

webStudentsRouter.post("/:id/edit", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await updateStudent(id, req.body);
    res.redirect("/students");
  } catch (err: any) {
    res.redirect(
      "/students?error=" + encodeURIComponent(err.message ?? "Failed to update")
    );
  }
});

webStudentsRouter.post("/:id/delete", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const deleted = await deleteStudent(id);
    if (!deleted) {
      return res.redirect("/students?error=Student+not+found");
    }
    res.redirect("/students");
  } catch (err: any) {
    res.redirect(
      "/students?error=" +
        encodeURIComponent(
          err.message ?? "Failed to delete (maybe has enrollments)"
        )
    );
  }
});

