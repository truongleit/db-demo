import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { DetailShell } from "../../components/layout/DetailShell";
import { deleteCourse, getCourse, updateCourse } from "../../lib/api";

type Course = {
  id: number;
  code: string;
  title: string;
  department_id: number;
  credits: number;
};

export function CourseDetailPage() {
  const params = useParams();
  const id = useMemo(() => Number(params.id), [params.id]);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    code: "",
    title: "",
    department_id: "",
    credits: "",
  });

  async function load() {
    if (!Number.isFinite(id)) {
      setCourse(null);
      setLoading(false);
      setError("Invalid course id");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = (await getCourse(id)) as Course;
      setCourse(data);
      setForm({
        code: data.code ?? "",
        title: data.title ?? "",
        department_id: String(data.department_id ?? ""),
        credits: String(data.credits ?? ""),
      });
    } catch (e: unknown) {
      setCourse(null);
      setError(e instanceof Error ? e.message : "Failed to load course");
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
    if (!course) return;

    try {
      setSaving(true);
      setError(null);
      await updateCourse(course.id, {
        code: form.code,
        title: form.title,
        department_id: Number(form.department_id),
        credits: Number(form.credits),
      });
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update course");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!course) return;
    if (!confirm("Delete this course?")) return;

    try {
      setSaving(true);
      setError(null);
      await deleteCourse(course.id);
      window.location.assign("/courses");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete course");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DetailShell
      title="Course"
      subtitle={course ? `${course.code} — ${course.title}` : undefined}
      actions={
        course ? (
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
      ) : !course ? (
        <div className="space-y-3 py-2">
          <p className="text-sm text-slate-400">Course not found.</p>
          <Link className="text-sm underline" to="/courses">
            Back to courses
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="ID" value={String(course.id)} />
            <Field label="Department ID" value={String(course.department_id)} />
            <Field label="Credits" value={String(course.credits)} />
            <Field label="Code" value={course.code} />
            <div className="sm:col-span-2">
              <Field label="Title" value={course.title} />
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-4">
            <h3 className="text-sm font-medium text-[var(--text)]">
              Edit course
            </h3>
            <form onSubmit={handleSave} className="mt-3 grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="Code"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                required
              />
              <Input
                placeholder="Credits"
                value={form.credits}
                onChange={(e) =>
                  setForm((f) => ({ ...f, credits: e.target.value }))
                }
                required
              />
              <Input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
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

              <div className="flex items-center gap-2 sm:col-span-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setForm({
                      code: course.code ?? "",
                      title: course.title ?? "",
                      department_id: String(course.department_id ?? ""),
                      credits: String(course.credits ?? ""),
                    })
                  }
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

