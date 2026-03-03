import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getAllCoursesWithDepartment,
  getCourseById,
  updateCourse,
} from "../../models/courses";

export const webCoursesRouter = Router();

webCoursesRouter.get("/", async (req, res) => {
  const error = req.query.error as string | undefined;
  const courses = await getAllCoursesWithDepartment();
  res.render("courses/index", { courses, error });
});

webCoursesRouter.get("/new", (_req, res) => {
  res.render("courses/new");
});

webCoursesRouter.post("/", async (req, res) => {
  const { code, title, department_id, credits } = req.body;
  if (!code || !title || !department_id || !credits) {
    return res.redirect("/courses?error=Missing+required+fields");
  }
  try {
    await createCourse({
      code,
      title,
      department_id: Number(department_id),
      credits: Number(credits),
    });
    res.redirect("/courses");
  } catch (err: any) {
    res.redirect(
      "/courses?error=" + encodeURIComponent(err.message ?? "Failed to create")
    );
  }
});

webCoursesRouter.get("/:id/edit", async (req, res) => {
  const id = Number(req.params.id);
  const course = await getCourseById(id);
  if (!course) {
    return res.redirect("/courses?error=Course+not+found");
  }
  res.render("courses/edit", { course });
});

webCoursesRouter.post("/:id/edit", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await updateCourse(id, req.body);
    res.redirect("/courses");
  } catch (err: any) {
    res.redirect(
      "/courses?error=" + encodeURIComponent(err.message ?? "Failed to update")
    );
  }
});

webCoursesRouter.post("/:id/delete", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const deleted = await deleteCourse(id);
    if (!deleted) {
      return res.redirect("/courses?error=Course+not+found");
    }
    res.redirect("/courses");
  } catch (err: any) {
    res.redirect(
      "/courses?error=" +
        encodeURIComponent(err.message ?? "Failed to delete course")
    );
  }
});

