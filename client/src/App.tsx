import { Route, Routes, Navigate } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { StudentsPage } from "./features/students/StudentsPage";
import { CoursesPage } from "./features/courses/CoursesPage";
import { DepartmentsPage } from "./features/departments/DepartmentsPage";
import { EnrollmentsPage } from "./features/enrollments/EnrollmentsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/students" replace />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="enrollments" element={<EnrollmentsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
