DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  department_id INT NOT NULL,
  enrollment_year INT NOT NULL,
  CONSTRAINT fk_students_department
    FOREIGN KEY (department_id) REFERENCES departments(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  department_id INT NOT NULL,
  credits INT NOT NULL,
  CONSTRAINT fk_courses_department
    FOREIGN KEY (department_id) REFERENCES departments(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  semester VARCHAR(20) NOT NULL,
  grade VARCHAR(5) NULL,
  CONSTRAINT fk_enrollments_student
    FOREIGN KEY (student_id) REFERENCES students(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_enrollments_course
    FOREIGN KEY (course_id) REFERENCES courses(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT uq_enrollment UNIQUE (student_id, course_id, semester)
);

INSERT INTO departments (name, code) VALUES
  ('Computer Science', 'CS'),
  ('Mathematics', 'MATH'),
  ('Physics', 'PHYS');

INSERT INTO students (first_name, last_name, email, department_id, enrollment_year) VALUES
  ('Alice', 'Nguyen', 'alice.nguyen@example.edu', 1, 2023),
  ('Bob', 'Tran', 'bob.tran@example.edu', 1, 2022),
  ('Carol', 'Le', 'carol.le@example.edu', 2, 2024),
  ('David', 'Pham', 'david.pham@example.edu', 3, 2021);

INSERT INTO courses (code, title, department_id, credits) VALUES
  ('CS101', 'Introduction to Programming', 1, 4),
  ('CS201', 'Data Structures', 1, 4),
  ('MATH101', 'Calculus I', 2, 3),
  ('PHYS101', 'General Physics', 3, 3);

INSERT INTO enrollments (student_id, course_id, semester, grade) VALUES
  (1, 1, '2024-Fall', 'A'),
  (1, 3, '2024-Fall', 'B+'),
  (2, 1, '2023-Fall', 'B'),
  (3, 3, '2024-Spring', NULL),
  (4, 4, '2023-Fall', 'A-');

