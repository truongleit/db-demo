import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { getCourses, createCourse, deleteCourse } from "../../lib/api";

interface Course {
  id: number;
  code: string;
  title: string;
  department_id: number;
  credits: number;
}

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: "",
    title: "",
    department_id: "",
    credits: "",
  });

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await getCourses();
      setCourses(data);
    } catch (e: any) {
      setError(e.message ?? "Failed to load courses");
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
      await createCourse({
        code: form.code,
        title: form.title,
        department_id: Number(form.department_id),
        credits: Number(form.credits),
      });
      setForm({
        code: "",
        title: "",
        department_id: "",
        credits: "",
      });
      await load();
    } catch (e: any) {
      setError(e.message ?? "Failed to create course");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this course?")) return;
    try {
      await deleteCourse(id);
      await load();
    } catch (e: any) {
      setError(e.message ?? "Failed to delete course");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Courses</h2>
      </header>

      {error && (
        <div className="rounded-md border border-red-500 bg-red-900/40 px-3 py-2 text-sm text-red-100">
          {error}
        </div>
      )}

      <section className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 space-y-3 shadow-sm">
        <h3 className="text-sm font-medium text-[var(--text)]">
          Create new course
        </h3>
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end"
        >
          <Input
            placeholder="Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
          />
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Input
            placeholder="Department ID"
            value={form.department_id}
            onChange={(e) =>
              setForm({ ...form, department_id: e.target.value })
            }
            required
          />
          <Input
            placeholder="Credits"
            value={form.credits}
            onChange={(e) => setForm({ ...form, credits: e.target.value })}
            required
          />
          <Button type="submit">Create</Button>
        </form>
      </section>

      <section className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] shadow-sm overflow-hidden">
        <div className="border-b border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)]">
          All courses
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-black/5 dark:bg-black/40">
              <tr>
                <th className="border-b border-[var(--border)] px-3 py-2 text-left font-medium">
                  Code
                </th>
                <th className="border-b border-[var(--border)] px-3 py-2 text-left font-medium">
                  Title
                </th>
                <th className="border-b border-[var(--border)] px-3 py-2 text-left font-medium">
                  Department
                </th>
                <th className="border-b border-[var(--border)] px-3 py-2 text-left font-medium">
                  Credits
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
              ) : courses.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-slate-400"
                  >
                    No courses yet.
                  </td>
                </tr>
              ) : (
                courses.map((c, idx) => (
                  <tr
                    key={c.id}
                    className={
                      idx % 2 === 0
                        ? "bg-black/5 dark:bg-black/40"
                        : "bg-transparent"
                    }
                  >
                    <td className="border-b border-[var(--border)] px-3 py-2">
                      {c.code}
                    </td>
                    <td className="border-b border-[var(--border)] px-3 py-2">
                      {c.title}
                    </td>
                    <td className="border-b border-[var(--border)] px-3 py-2">
                      {c.department_id}
                    </td>
                    <td className="border-b border-[var(--border)] px-3 py-2">
                      {c.credits}
                    </td>
                    <td className="border-b border-[var(--border)] px-3 py-2 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(c.id)}
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

