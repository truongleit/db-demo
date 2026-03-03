import { useEffect, useState } from "react";
import { getDepartments } from "../../lib/api";

interface Department {
  id: number;
  name: string;
  code: string;
}

export function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDepartments();
        setDepartments(data);
      } catch (e: any) {
        setError(e.message ?? "Failed to load departments");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Departments</h2>

      {error && (
        <div className="rounded-md border border-red-500 bg-red-900/40 px-3 py-2 text-sm text-red-100">
          {error}
        </div>
      )}

      <section className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] shadow-sm overflow-hidden">
        <div className="border-b border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)]">
          All departments
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-black/5 dark:bg-black/40">
              <tr>
                <th className="border-b border-[var(--border)] px-3 py-2 text-left font-medium">
                  ID
                </th>
                <th className="border-b border-[var(--border)] px-3 py-2 text-left font-medium">
                  Code
                </th>
                <th className="border-b border-[var(--border)] px-3 py-2 text-left font-medium">
                  Name
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-4 text-center text-slate-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : departments.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-4 text-center text-slate-400"
                  >
                    No departments.
                  </td>
                </tr>
              ) : (
                departments.map((d, idx) => (
                  <tr
                    key={d.id}
                    className={
                      idx % 2 === 0
                        ? "bg-black/5 dark:bg-black/40"
                        : "bg-transparent"
                    }
                  >
                    <td className="border-b border-[var(--border)] px-3 py-2">
                      {d.id}
                    </td>
                    <td className="border-b border-[var(--border)] px-3 py-2">
                      {d.code}
                    </td>
                    <td className="border-b border-[var(--border)] px-3 py-2">
                      {d.name}
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

