"use strict";

const { Pool } = require("pg");
require("dotenv").config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

class DbAccess {
  constructor() {
    // Create a new pool object
    this.pool = new Pool({
      user: dbUser,
      host: dbHost,
      database: dbName,
      password: dbPassword,
    });
  }

  // Test the connection to the database
  async testDb() {
    let client;
    try {
      client = await this.pool.connect();
      return true;
    } catch (err) {
      err = new Error(`Error connecting to database: ${err.message}`);
      throw err;
    } finally {
      if (client) {
        await client.release();
      }
    }
  }

  // End the connection to the database
  async end() {
    try {
      await this.pool.end();
    } catch (err) {
      err = new Error(`Error ending connection to database: ${err.message}`);
      throw err;
    }
  }

  async getAllEmployees() {
    let client;
    try {
      client = await this.pool.connect();
      const result = await client.query(
        `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        JOIN role r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
        ORDER BY e.id;`
      );
      return result.rows;
    } catch (err) {
      err = new Error(
        `Error getting all records from 'employee' table: ${err.message}`
      );
      throw err;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async getAllRoles() {
    let client;
    try {
      client = await this.pool.connect();
      const result = await client.query(`
      SELECT r.id, title, d.name AS department, salary
      FROM role r JOIN department d ON r.department_id = d.id`);
      return result.rows;
    } catch (err) {
      err = new Error(
        `Error getting all records from 'role' table: ${err.message}`
      );
      throw err;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async getAllDepartments() {
    let client;
    try {
      client = await this.pool.connect();
      const result = await client.query(`SELECT * FROM department;`);
      return result.rows;
    } catch (err) {
      err = new Error(
        `Error getting all records from ${table}: ${err.message}`
      );
      throw err;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async getEmployeeByManager(managerId) {
    let client;
    try {
      client = await this.pool.connect();
      const result = await client.query(
        `SELECT emp.*,(mng.first_name || ' ' || mng.last_name) AS manager_name 
        FROM employee emp JOIN employee mng ON emp.manager_id = mng.id
        WHERE emp.manager_id = $1;`,
        [managerId]
      );
      return result.rows;
    } catch (err) {
      err = new Error(
        `Error getting records from 'employee' table for managerID: ${err.message}`
      );
      throw err;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async getEmployeeByDepartment(departmentId) {
    let client;
    try {
      client = await this.pool.connect();
      const result = await client.query(
        `
        SELECT e.*,d.name AS department_name
        FROM role r JOIN department d ON r.department_id = d.id
        JOIN employee e ON e.role_id = r.id
        WHERE d.id = $1;`,
        [departmentId]
      );
      return result.rows;
    } catch (err) {
      err = new Error(
        `Error getting records from 'employee' table for departmentID: ${err.message}`
      );
      throw err;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async getEmployeeById(employeeId) {
    let client;
    try {
      client = await this.pool.connect();
      const result = await client.query(
        `select e.*,title as role_title
        from employee e join role r on e.role_id = r.id
        where e.id = $1;`,
        [employeeId]
      );
      return result.rows;
    } catch (err) {
      err = new Error(
        `Error getting records from 'employee' table for employeeID: ${err.message}`
      );
      throw err;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async getTotalUtilizedBudget(departmentId) {
    let client;
    try {
      client = await this.pool.connect();
      const result = await client.query(
        `
        SELECT d.name AS department_name,to_char(SUM(r.salary), 'FM$999,999,999,990.00') as  total_utilized_budget
        FROM role r JOIN department d ON r.department_id = d.id
        JOIN employee e ON e.role_id = r.id
        WHERE d.id = $1
        GROUP BY d.name`,
        [departmentId]
      );
      return result.rows;
    } catch (err) {
      err = new Error(
        `Error getting total utilized budget from 'employee' table for departmentID: ${err.message}`
      );
      throw err;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async getManagers() {
    let client;
    try {
      client = await this.pool.connect();
      const result = await client.query(
        `SELECT DISTINCT mng.id, mng.first_name || ' ' || mng.last_name AS manager_name
        FROM employee emp JOIN employee mng ON emp.manager_id = mng.id
        ORDER BY manager_name;`
      );
      return result.rows;
    } catch (err) {
      err = new Error(
        `Error getting all managers from 'employee' table: ${err.message}`
      );
      throw err;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async #addRow(queryString, values, tableName) {
    let client;
    try {
      client = await this.pool.connect();
      await client.query(queryString, values);
    } catch (err) {
      err = new Error(
        `Error adding record to '${tableName}' table: ${err.message}`
      );
      throw err;
    } finally {
      if (client) {
        client.release();
      }
    }
  }
  async addEmployee(employee) {
    const queryString = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);`;
    const values = [
      employee.firstName,
      employee.lastName,
      employee.roleId,
      employee.managerId,
    ];
    await this.#addRow(queryString, values, "employee");
  }

  async addRole(role) {
    const queryString = `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *;`;
    const values = [role.title, role.salary, role.departmentId];
    await this.#addRow(queryString, values, "role");
  }

  async addDepartment(department) {
    const queryString = `INSERT INTO department (name) VALUES ($1) RETURNING *;`;
    const values = [department.name];
    await this.#addRow(queryString, values, "department");
  }

  async updateEmployeeRole(employee) {
    let client;
    try {
      client = await this.pool.connect();
      await client.query(`UPDATE employee SET role_id = $1 WHERE id = $2;`, [
        employee.roleId,
        employee.employeeId,
      ]);
    } catch (err) {
      err = new Error(
        `Error updating record in 'employee' table: ${err.message}`
      );
      throw err;
    } finally {
      if (client) {
        client.release();
      }
    }
  }
}

module.exports = { DbAccess };
