import { NavLink, Outlet } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { useTheme } from "../../theme/ThemeProvider";

export function AppShell() {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen flex app-shell">
      <aside className="app-shell-aside space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Student DB Demo
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Simple CRUD for students, courses and enrollments.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggle}
            className="border border-[var(--border)] bg-transparent hover:bg-black/5 dark:hover:bg-white/10"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
        <nav className="flex flex-col gap-2">
          <NavItem to="/students">Students</NavItem>
          <NavItem to="/courses">Courses</NavItem>
          <NavItem to="/departments">Departments</NavItem>
          <NavItem to="/enrollments">Enrollments</NavItem>
        </nav>
      </aside>
      <main className="app-shell-main">
        <div className="app-shell-inner space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "w-full text-left",
          isActive ? "font-semibold text-slate-50" : "text-slate-300"
        )
      }
    >
      {({ isActive }) => (
        <Button
          variant={isActive ? "default" : "ghost"}
          className="w-full justify-start"
        >
          {children}
        </Button>
      )}
    </NavLink>
  );
}

