import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { DetailShell } from "../../components/layout/DetailShell";
import { deleteStudent, getStudent, updateStudent } from "../../lib/api";

type Student = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department_id: number;
  enrollment_year: number;
};

export function StudentDetailPage() {
  const params = useParams();
  const id = useMemo(() => Number(params.id), [params.id]);

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department_id: "",
    enrollment_year: "",
  });

  async function load() {
    if (!Number.isFinite(id)) {
      setStudent(null);
      setLoading(false);
      setError("Invalid student id");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = (await getStudent(id)) as Student;
      setStudent(data);
      setForm({
        first_name: data.first_name ?? "",
        last_name: data.last_name ?? "",
        email: data.email ?? "",
        department_id: String(data.department_id ?? ""),
        enrollment_year: String(data.enrollment_year ?? ""),
      });
    } catch (e: unknown) {
      setStudent(null);
      setError(e instanceof Error ? e.message : "Failed to load student");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!student) return;

    try {
      setSaving(true);
      setError(null);
      await updateStudent(student.id, {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        department_id: Number(form.department_id),
        enrollment_year: Number(form.enrollment_year),
      });
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update student");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!student) return;
    if (!confirm("Delete this student?")) return;

    try {
      setSaving(true);
      setError(null);
      await deleteStudent(student.id);
      // Let Back take the user to the list; also provide a stable link if they landed deep.
      window.location.assign("/students");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete student");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DetailShell
      title="Student"
      subtitle={student ? `${student.first_name} ${student.last_name}` : undefined}
      actions={
        student ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={saving}
          >
            Delete
          </Button>
        ) : null
      }
    >
      {error ? (
        <div className="mb-3 rounded-md border border-red-500 bg-red-900/40 px-3 py-2 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="py-6 text-center text-sm text-slate-400">
          Loading...
        </div>
      ) : !student ? (
        <div className="space-y-3 py-2">
          <p className="text-sm text-slate-400">Student not found.</p>
          <Link className="text-sm underline" to="/students">
            Back to students
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="ID" value={String(student.id)} />
            <Field label="Department ID" value={String(student.department_id)} />
            <Field label="Email" value={student.email} />
            <Field label="Enrollment year" value={String(student.enrollment_year)} />
          </div>

          <div className="border-t border-[var(--border)] pt-4">
            <h3 className="text-sm font-medium text-[var(--text)]">
              Edit student
            </h3>
            <form onSubmit={handleSave} className="mt-3 grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="First name"
                value={form.first_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, first_name: e.target.value }))
                }
                required
              />
              <Input
                placeholder="Last name"
                value={form.last_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, last_name: e.target.value }))
                }
                required
              />
              <Input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
              <Input
                placeholder="Department ID"
                value={form.department_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, department_id: e.target.value }))
                }
                required
              />
              <Input
                placeholder="Enrollment year"
                value={form.enrollment_year}
                onChange={(e) =>
                  setForm((f) => ({ ...f, enrollment_year: e.target.value }))
                }
                required
              />

              <div className="flex items-center gap-2 sm:col-span-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setForm({
                    first_name: student.first_name ?? "",
                    last_name: student.last_name ?? "",
                    email: student.email ?? "",
                    department_id: String(student.department_id ?? ""),
                    enrollment_year: String(student.enrollment_year ?? ""),
                  })}
                  disabled={saving}
                >
                  Reset
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DetailShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-black/5 dark:bg-black/40 px-3 py-2">
      <div className="text-xs font-medium text-slate-400">{label}</div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}

