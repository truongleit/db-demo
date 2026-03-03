const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function apiRequest(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      (isJson && body?.error?.message) ||
      (typeof body === "string" ? body : res.statusText);
    throw new Error(message || `Request failed with ${res.status}`);
  }

  if (isJson && body && typeof body === "object" && "data" in body) {
    return (body as any).data;
  }
  return body;
}

// Students
export function getStudents() {
  return apiRequest("/api/students");
}

export function createStudent(payload: {
  first_name: string;
  last_name: string;
  email: string;
  department_id: number;
  enrollment_year: number;
}) {
  return apiRequest("/api/students", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteStudent(id: number) {
  return apiRequest(`/api/students/${id}`, { method: "DELETE" });
}

// Courses
export function getCourses() {
  return apiRequest("/api/courses");
}

export function createCourse(payload: {
  code: string;
  title: string;
  department_id: number;
  credits: number;
}) {
  return apiRequest("/api/courses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteCourse(id: number) {
  return apiRequest(`/api/courses/${id}`, { method: "DELETE" });
}

// Departments
export function getDepartments() {
  return apiRequest("/api/departments");
}

// Enrollments
export function getEnrollments() {
  return apiRequest("/api/enrollments");
}

export function createEnrollment(payload: {
  student_id: number;
  course_id: number;
  semester: string;
  grade: string | null;
}) {
  return apiRequest("/api/enrollments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteEnrollment(id: number) {
  return apiRequest(`/api/enrollments/${id}`, { method: "DELETE" });
}

