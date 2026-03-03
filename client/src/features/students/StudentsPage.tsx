import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { getStudents, createStudent, deleteStudent } from "../../lib/api";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department_id: number;
  enrollment_year: number;
}

export function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department_id: "",
    enrollment_year: "",
  });

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await getStudents();
      setStudents(data);
    } catch (e: any) {
      setError(e.message ?? "Failed to load students");
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
      await createStudent({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        department_id: Number(form.department_id),
        enrollment_year: Number(form.enrollment_year),
      });
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        department_id: "",
        enrollment_year: "",
      });
      await load();
    } catch (e: any) {
      setError(e.message ?? "Failed to create student");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this student?")) return;
    try {
      await deleteStudent(id);
      await load();
    } catch (e: any) {
      setError(e.message ?? "Failed to delete student");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Students</h2>
        <p className="text-sm text-slate-400">
          Manage basic student records used throughout the demo.
        </p>
      </header>

      {error && (
        <div className="rounded-md border border-red-500 bg-red-900/40 px-3 py-2 text-sm text-red-100">
          {error}
        </div>
      )}

      <section className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 space-y-3 shadow-sm">
        <h3 className="text-sm font-medium text-[var(--text)]">
          Create new student
        </h3>
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 items-end"
        >
          <Input
            placeholder="First name"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            required
          />
          <Input
            placeholder="Last name"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            required
          />
          <Input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
            placeholder="Enrollment year"
            value={form.enrollment_year}
            onChange={(e) =>
              setForm({ ...form, enrollment_year: e.target.value })
            }
            required
          />
          <Button type="submit">Create</Button>
        </form>
      </section>

      <section className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] shadow-sm overflow-hidden">
        <div className="border-b border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)]">
          All students
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-black/5 dark:bg-black/40">
              <tr>
                <th className="border-b border-[var(--border)] px-3 py-2 text-left font-medium">
                  Name
                </th>
                <th className="border-b border-[var(--border)] px-3 py-2 text-left font-medium">
                  Email
                </th>
                <th className="border-b border-[var(--border)] px-3 py-2 text-left font-medium">
                  Department
                </th>
                <th className="border-b border-[var(--border)] px-3 py-2 text-left font-medium">
                  Year
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
              ) : students.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-slate-400"
                  >
                    No students yet.
                  </td>
                </tr>
              ) : (
                students.map((s, idx) => (
                  <tr
                    key={s.id}
                    className={
                      idx % 2 === 0
                        ? "bg-black/5 dark:bg-black/40"
                        : "bg-transparent"
                    }
                  >
                    <td className="border-b border-[var(--border)] px-3 py-2">
                      {s.first_name} {s.last_name}
                    </td>
                    <td className="border-b border-[var(--border)] px-3 py-2">
                      {s.email}
                    </td>
                    <td className="border-b border-[var(--border)] px-3 py-2">
                      {s.department_id}
                    </td>
                    <td className="border-b border-[var(--border)] px-3 py-2">
                      {s.enrollment_year}
                    </td>
                    <td className="border-b border-[var(--border)] px-3 py-2 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(s.id)}
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

