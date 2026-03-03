import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  getEnrollments,
  createEnrollment,
  deleteEnrollment,
  getStudents,
  getCourses,
} from "../../lib/api";

interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  semester: string;
  grade: string | null;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
}

interface Course {
  id: number;
  code: string;
  title: string;
}

export function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    student_id: "",
    course_id: "",
    semester: "",
    grade: "",
  });

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const [enr, sts, crs] = await Promise.all([
        getEnrollments(),
        getStudents(),
        getCourses(),
      ]);
      setEnrollments(enr);
      setStudents(sts);
      setCourses(crs);
    } catch (e: any) {
      setError(e.message ?? "Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createEnrollment({
        student_id: Number(form.student_id),
        course_id: Number(form.course_id),
        semester: form.semester,
        grade: form.grade || null,
      });
      setForm({
        student_id: "",
        course_id: "",
        semester: "",
        grade: "",
      });
      await load();
    } catch (e: any) {
      setError(e.message ?? "Failed to create enrollment");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this enrollment?")) return;
    try {
      await deleteEnrollment(id);
      await load();
    } catch (e: any) {
      setError(e.message ?? "Failed to delete enrollment");
    }
  }

  function studentLabel(id: number) {
    const s = students.find((st) => st.id === id);
    if (!s) return id;
    return `${s.first_name} ${s.last_name}`;
  }

  function courseLabel(id: number) {
    const c = courses.find((cr) => cr.id === id);
    if (!c) return id;
    return `${c.code} - ${c.title}`;
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Enrollments</h2>
      </header>

      {error && (
        <div className="rounded-md border border-red-500 bg-red-900/40 px-3 py-2 text-sm text-red-100">
          {error}
        </div>
      )}

      <section className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 space-y-3 shadow-sm">
        <h3 className="text-sm font-medium text-[var(--text)]">
          Enroll a student in a course
        </h3>
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
        >
          <select
            className="h-9 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-2 text-sm text-[var(--text)]"
            value={form.student_id}
            onChange={(e) =>
              setForm({ ...form, student_id: e.target.value })
            }
            required
          >
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.first_name} {s.last_name}
              </option>
            ))}
          </select>

          <select
            className="h-9 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-2 text-sm text-[var(--text)]"
            value={form.course_id}
            onChange={(e) => setForm({ ...form, course_id: e.target.value })}
            required
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.title}
              </option>
            ))}
          </select>

          <Input
            placeholder="Semester (e.g. 2025-Fall)"
            value={form.semester}
            onChange={(e) => setForm({ ...form, semester: e.target.value })}
            required
          />
          <Input
            placeholder="Grade (optional)"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
          />

          <Button type="submit">Enroll</Button>
        </form>
      </section>

      <section className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] shadow-sm overflow-hidden">
        <div className="border-b border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)]">
          All enrollments
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-black/5 dark:bg-black/40">
              <tr>
                <th className="border-b border-[var(--border)] px-3 py-2 text-left font-medium">
                  Student
                </th>
                <th className="border-b border-[var(--border)] px-3 py-2 text-left font-medium">
                  Course
                </th>
                <th className="border-b border-[var(--border)] px-3 py-2 text-left font-medium">
                  Semester
                </th>
                <th className="border-b border-[var(--border)] px-3 py-2 text-left font-medium">
                  Grade
                </th>
                <th className="border-b border-[var(--border)] px-3 py-2 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-slate-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : enrollments.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-slate-400"
                  >
                    No enrollments.
                  </td>
                </tr>
              ) : (
                enrollments.map((e, idx) => (
                  <tr
                    key={e.id}
                    className={
                      idx % 2 === 0
                        ? "bg-black/5 dark:bg-black/40"
                        : "bg-transparent"
                    }
                  >
                    <td className="border-b border-[var(--border)] px-3 py-2">
                      {studentLabel(e.student_id)}
                    </td>
                    <td className="border-b border-[var(--border)] px-3 py-2">
                      {courseLabel(e.course_id)}
                    </td>
                    <td className="border-b border-[var(--border)] px-3 py-2">
                      {e.semester}
                    </td>
                    <td className="border-b border-[var(--border)] px-3 py-2">
                      {e.grade ?? ""}
                    </td>
                    <td className="border-b border-[var(--border)] px-3 py-2 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(e.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

