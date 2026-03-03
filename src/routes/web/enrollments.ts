import { Router } from "express";
import { getAllEnrollmentsWithDetails, createEnrollment, deleteEnrollment } from "../../models/enrollments";
import { getAllStudents } from "../../models/students";
import { getAllCourses } from "../../models/courses";

export const webEnrollmentsRouter = Router();

webEnrollmentsRouter.get("/", async (req, res) => {
  const error = req.query.error as string | undefined;
  const enrollments = await getAllEnrollmentsWithDetails();
  res.render("enrollments/index", { enrollments, error });
});

webEnrollmentsRouter.get("/new", async (_req, res) => {
  const students = await getAllStudents();
  const courses = await getAllCourses();
  res.render("enrollments/new", { students, courses });
});

webEnrollmentsRouter.post("/", async (req, res) => {
  const { student_id, course_id, semester, grade } = req.body;
  if (!student_id || !course_id || !semester) {
    return res.redirect("/enrollments?error=Missing+required+fields");
  }
  try {
    await createEnrollment({
      student_id: Number(student_id),
      course_id: Number(course_id),
      semester,
      grade: grade || null,
    });
    res.redirect("/enrollments");
  } catch (err: any) {
    res.redirect(
      "/enrollments?error=" +
        encodeURIComponent(err.message ?? "Failed to create enrollment")
    );
  }
});

webEnrollmentsRouter.post("/:id/delete", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const deleted = await deleteEnrollment(id);
    if (!deleted) {
      return res.redirect("/enrollments?error=Enrollment+not+found");
    }
    res.redirect("/enrollments");
  } catch (err: any) {
    res.redirect(
      "/enrollments?error=" +
        encodeURIComponent(err.message ?? "Failed to delete enrollment")
    );
  }
});

