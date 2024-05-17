-- add sample data to the database

\c employee;

INSERT INTO department (name) VALUES ('Engineering'), ('Sales'), ('Marketing');

INSERT INTO role (title, salary, department_id) VALUES
('Software Engineer', 100000, 1),
('Sales Manager', 120000, 2),
('Marketing Manager', 110000, 3),
('Product Manager', 130000, 1),
('Salesperson', 80000, 2),
('Marketing Associate', 70000, 3),
('Software Engineering Manager', 140000, 1),
('Fullstack Developer', 60000, 1),
('Database Engineer', 65000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Alice', 'Johnson', 1, NULL),
('Bob', 'Smith', 2, 1),
('Charlie', 'Brown', 3, 1),
('David', 'Wilson', 4, 1),
('Edward', 'Young', 5, 2),
('Frank', 'Green', 6, 3),
('Grace', 'Baker', 7, 4),
('Hannah', 'Hill', 8, 7),
('Ivy', 'Lee', 9, 7),
('Jack', 'King', 9, 7),
('Kevin', 'Cole', 9, 7),
('Lily', 'Adams', 9, 7),
('Mike', 'Barnes', 6, 3),
('Nancy', 'Ford', 6, 3),
('Oscar', 'Cooper', 6, 3),
('Peter', 'Dunn', 6, 3),
('Quinn', 'Evans', 6, 3),
('Rose', 'Gardner', 6, 3),
('Sam', 'Harrison', 6, 3),
('Tom', 'Irwin', 6, 3),
('Uma', 'Jones', 6, 3);


