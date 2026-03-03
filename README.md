## Student DB Demo – Node.js + MySQL

Simple educational backend that demonstrates CRUD with a small university-style schema (students, courses, departments, enrollments) using Node.js + Express + TypeScript and MySQL in Docker. It is designed so you can later add a minimal React or Vue frontend in a separate `client/` folder.

### Prerequisites

- **Node.js**: LTS (e.g. 20.x)
- **Docker & docker compose**

### Quick start

1. **Clone & install**

```bash
npm install
```

2. **Start MySQL (and Adminer UI) via Docker**

```bash
docker compose up -d
```

This will:

- Run MySQL on `localhost:3306`
- Create database `student_db` with user `student_app` / `student_password`
- Apply `db/schema.sql` (tables + seed data)
- Start Adminer on `http://localhost:8080` (connect with:
  - System: `MySQL`
  - Server: `mysql`
  - Username: `student_app`
  - Password: `student_password`
  - Database: `student_db`)

3. **Configure environment (optional)**

Defaults are already provided in `.env`:

```bash
PORT=3000
CORS_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=student_app
DB_PASSWORD=student_password
DB_NAME=student_db
```

Adjust if needed.

4. **Run the API in dev mode**

```bash
npm run dev
```

The server will start on `http://localhost:3000`.

Health check:

```bash
curl http://localhost:3000/api/health
```

### Schema overview

The database contains four main tables:

- **departments**: `id`, `name`, `code`
- **students**: `id`, `first_name`, `last_name`, `email`, `department_id`, `enrollment_year`
- **courses**: `id`, `code`, `title`, `department_id`, `credits`
- **enrollments**: `id`, `student_id`, `course_id`, `semester`, `grade`

Relationships:

- One department has many students and many courses.
- Many-to-many between students and courses via enrollments.

### API overview

All endpoints are JSON and live under `/api/...`, making it easy to attach a React/Vue SPA later on a separate origin (CORS is enabled and configurable).

#### Students

- **GET** `/api/students`
  - Optional query: `department_id`
- **GET** `/api/students/:id`
- **POST** `/api/students`
- **PUT** `/api/students/:id`
- **DELETE** `/api/students/:id`

Example create:

```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Eve",
    "last_name": "Ho",
    "email": "eve.ho@example.edu",
    "department_id": 1,
    "enrollment_year": 2025
  }'
```

#### Courses

- **GET** `/api/courses`
- **GET** `/api/courses/:id`
- **POST** `/api/courses`
- **PUT** `/api/courses/:id`
- **DELETE** `/api/courses/:id`

#### Departments

- **GET** `/api/departments`
- **GET** `/api/departments/:id`

#### Enrollments

- **GET** `/api/enrollments`
  - Optional query: `student_id`, `course_id`
- **POST** `/api/enrollments`
- **DELETE** `/api/enrollments/:id`

Example: enroll a student in a course:

```bash
curl -X POST http://localhost:3000/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "course_id": 2,
    "semester": "2025-Fall"
  }'
```

### Typical demo flow

1. List students:

```bash
curl http://localhost:3000/api/students
```

2. Create a student (see above).

3. List courses:

```bash
curl http://localhost:3000/api/courses
```

4. Enroll the new student in a course.

5. Filter enrollments by student:

```bash
curl "http://localhost:3000/api/enrollments?student_id=1"
```

6. Try deleting a student that has enrollments – you should get a `409` error indicating they cannot be deleted while enrollments exist.

### React + shadcn frontend (second demo)

This repo also includes a modern React frontend demo in the `client/` folder, built with:

- React + TypeScript (Vite)
- Tailwind CSS (v4)
- A small set of shadcn-style UI primitives (button, input, layout shell)

The frontend consumes the same `/api/...` endpoints to demonstrate CRUD for students and courses, plus read-only departments and enrollments (with enroll/unenroll).

#### Running backend + frontend together

1. **Start the database and backend API** (from repo root):

```bash
docker compose up -d
npm install       # if not done already
npm run dev       # backend on http://localhost:3000
```

2. **Start the React frontend**:

```bash
cd client
npm install       # first time only
npm run dev       # frontend on http://localhost:5173
```

3. **Open the frontend**:

- Visit `http://localhost:5173` in your browser.
- Use the navigation on the left to switch between:
  - **Students** – list existing students, create new ones, and delete.
  - **Courses** – list/create/delete courses.
  - **Departments** – read-only table of departments.
  - **Enrollments** – list enrollments and enroll a student into a course.

Because the API lives under `/api/...` and CORS is configured for `http://localhost:5173`, the frontend can call the backend directly without any proxy configuration.

