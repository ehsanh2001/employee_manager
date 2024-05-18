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

  // Get all records from the table specified
  async getAll(table) {
    let client;
    try {
      client = await this.pool.connect();
      const result = await client.query(`SELECT * FROM ${table};`);
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
}

module.exports = { DbAccess };
