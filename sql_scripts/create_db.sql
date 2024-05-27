--sql for postgres


DROP DATABASE IF EXISTS employee;

CREATE DATABASE employee;

-- connect to the database
\c employee;

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL CHECK (trim(name) <> '')
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) UNIQUE NOT NULL CHECK (trim(title) <> ''),
    salary DECIMAL NOT NULL CHECK (salary > 0),
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL CHECK (trim(first_name) <> ''),
    last_name VARCHAR(30) NOT NULL CHECK (trim(last_name) <> ''),
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);