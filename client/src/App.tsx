import { Route, Routes, Navigate } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { StudentsPage } from "./features/students/StudentsPage";
import { CoursesPage } from "./features/courses/CoursesPage";
import { DepartmentsPage } from "./features/departments/DepartmentsPage";
import { EnrollmentsPage } from "./features/enrollments/EnrollmentsPage";
import { StudentDetailPage } from "./features/students/StudentDetailPage.tsx";
import { CourseDetailPage } from "./features/courses/CourseDetailPage.tsx";
import { DepartmentDetailPage } from "./features/departments/DepartmentDetailPage.tsx";
import { EnrollmentDetailPage } from "./features/enrollments/EnrollmentDetailPage.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/students" replace />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="students/:id" element={<StudentDetailPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="departments/:id" element={<DepartmentDetailPage />} />
        <Route path="enrollments" element={<EnrollmentsPage />} />
        <Route path="enrollments/:id" element={<EnrollmentDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
