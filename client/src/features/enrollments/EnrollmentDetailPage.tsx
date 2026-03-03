import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { DetailShell } from "../../components/layout/DetailShell";
import { deleteEnrollment, getEnrollmentFromList } from "../../lib/api";

type Enrollment = {
  id: number;
  student_id: number;
  course_id: number;
  semester: string;
  grade: string | null;
  student_name?: string;
  student_email?: string;
  course_code?: string;
  course_title?: string;
};

export function EnrollmentDetailPage() {
  const params = useParams();
  const id = useMemo(() => Number(params.id), [params.id]);

  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!Number.isFinite(id)) {
      setEnrollment(null);
      setLoading(false);
      setError("Invalid enrollment id");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = (await getEnrollmentFromList(id)) as Enrollment | null;
      setEnrollment(data);
    } catch (e: unknown) {
      setEnrollment(null);
      setError(e instanceof Error ? e.message : "Failed to load enrollment");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleDelete() {
    if (!enrollment) return;
    if (!confirm("Delete this enrollment?")) return;

    try {
      setWorking(true);
      setError(null);
      await deleteEnrollment(enrollment.id);
      window.location.assign("/enrollments");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete enrollment");
    } finally {
      setWorking(false);
    }
  }

  const subtitle =
    enrollment?.student_name && enrollment?.course_code
      ? `${enrollment.student_name} → ${enrollment.course_code} (${enrollment.semester})`
      : undefined;

  return (
    <DetailShell
      title="Enrollment"
      subtitle={subtitle}
      actions={
        enrollment ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={working}
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
      ) : !enrollment ? (
        <div className="space-y-3 py-2">
          <p className="text-sm text-slate-400">Enrollment not found.</p>
          <Link className="text-sm underline" to="/enrollments">
            Back to enrollments
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="ID" value={String(enrollment.id)} />
          <Field label="Semester" value={enrollment.semester} />
          <Field label="Student ID" value={String(enrollment.student_id)} />
          <Field label="Course ID" value={String(enrollment.course_id)} />
          <Field label="Grade" value={enrollment.grade ?? ""} />
          <Field
            label="Student"
            value={enrollment.student_name ?? ""}
          />
          <Field
            label="Course"
            value={
              enrollment.course_code
                ? `${enrollment.course_code}${enrollment.course_title ? ` — ${enrollment.course_title}` : ""}`
                : ""
            }
          />
          <Field label="Student email" value={enrollment.student_email ?? ""} />
        </div>
      )}
    </DetailShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-black/5 dark:bg-black/40 px-3 py-2">
      <div className="text-xs font-medium text-slate-400">{label}</div>
      <div className="mt-1 text-sm break-words">{value}</div>
    </div>
  );
}

