import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DetailShell } from "../../components/layout/DetailShell";
import { getDepartment } from "../../lib/api";

type Department = {
  id: number;
  name: string;
  code: string;
};

export function DepartmentDetailPage() {
  const params = useParams();
  const id = useMemo(() => Number(params.id), [params.id]);

  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!Number.isFinite(id)) {
        setDepartment(null);
        setLoading(false);
        setError("Invalid department id");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = (await getDepartment(id)) as Department;
        setDepartment(data);
      } catch (e: unknown) {
        setDepartment(null);
        setError(e instanceof Error ? e.message : "Failed to load department");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <DetailShell
      title="Department"
      subtitle={department ? `${department.code} — ${department.name}` : undefined}
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
      ) : !department ? (
        <div className="space-y-3 py-2">
          <p className="text-sm text-slate-400">Department not found.</p>
          <Link className="text-sm underline" to="/departments">
            Back to departments
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="ID" value={String(department.id)} />
          <Field label="Code" value={department.code} />
          <div className="sm:col-span-2">
            <Field label="Name" value={department.name} />
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

