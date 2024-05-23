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

  async #runQuery(queryString, values = []) {
    let client;
    try {
      client = await this.pool.connect();
      const result = await client.query(queryString, values);
      return result.rows;
    } catch (err) {
      err = new Error(`Error running query: ${err.message}`);
      throw err;
    } finally {
      if (client) {
        client.release();
      }
    }
  }
  async getAll(table) {
    return await this.#runQuery(`SELECT * FROM ${table};`, []);
  }

  async getAllEmployees() {
    const queryString = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e
      JOIN role r ON e.role_id = r.id
      JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id
      ORDER BY e.id;`;
    return await this.#runQuery(queryString);
  }

  async getAllRoles() {
    const queryString = `SELECT r.id, title, d.name AS department, salary
      FROM role r JOIN department d ON r.department_id = d.id`;
    return await this.#runQuery(queryString);
  }

  async getAllDepartments() {
    const queryString = `SELECT * FROM department;`;
    return await this.#runQuery(queryString);
  }

  async getEmployeeByManager(managerId) {
    const queryString = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e
      JOIN role r ON e.role_id = r.id
      JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id
      WHERE e.manager_id = $1
      ORDER BY e.id;`;
    return await this.#runQuery(queryString, [managerId]);
  }

  async getEmployeeByDepartment(departmentId) {
    const queryString = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e
      JOIN role r ON e.role_id = r.id
      JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id
      WHERE d.id = $1
      ORDER BY e.id;`;
    return await this.#runQuery(queryString, [departmentId]);
  }

  async getEmployeeById(employeeId) {
    const queryString = `SELECT e.*,r.title AS role_title
      FROM employee e JOIN role r ON e.role_id = r.id
      WHERE e.id = $1;`;
    return await this.#runQuery(queryString, [employeeId]);
  }

  async getTotalUtilizedBudget(departmentId) {
    const queryString = `SELECT d.name AS department_name,to_char(SUM(r.salary), 'FM$999,999,999,990.00') as  total_utilized_budget
      FROM role r JOIN department d ON r.department_id = d.id
      JOIN employee e ON e.role_id = r.id
      WHERE d.id = $1
      GROUP BY d.name`;
    return await this.#runQuery(queryString, [departmentId]);
  }

  async getManagers() {
    const queryString = `SELECT DISTINCT mng.id, mng.first_name || ' ' || mng.last_name AS manager_name
      FROM employee emp JOIN employee mng ON emp.manager_id = mng.id
      ORDER BY manager_name;`;
    return await this.#runQuery(queryString);
  }

  async addEmployee(employee) {
    const queryString = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);`;
    const values = [
      employee.firstName,
      employee.lastName,
      employee.roleId,
      employee.managerId,
    ];
    await this.#runQuery(queryString, values);
  }

  async addRole(role) {
    const queryString = `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);`;
    const values = [role.title, role.salary, role.departmentId];
    await this.#runQuery(queryString, values);
  }

  async addDepartment(department) {
    const queryString = `INSERT INTO department (name) VALUES ($1);`;
    const values = [department.name];
    await this.#runQuery(queryString, values);
  }

  async updateEmployeeRole(employee) {
    const queryString = `UPDATE employee SET role_id = $1 WHERE id = $2;`;
    const values = [employee.roleId, employee.employeeId];
    await this.#runQuery(queryString, values);
  }

  async updateEmployeeManager(employee) {
    const queryString = `UPDATE employee SET manager_id = $1 WHERE id = $2;`;
    const values = [employee.managerId, employee.employeeId];
    await this.#runQuery(queryString, values);
  }

  async deleteById(table, id) {
    const queryString = `DELETE FROM ${table} WHERE id = $1;`;
    await this.#runQuery(queryString, [id]);
  }
}

module.exports = { DbAccess };
