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
    try {
      let client = await this.pool.connect();
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
      let client = await this.pool.connect();
      const result = await client.query(`SELECT * FROM ${table};`);
      return result.rows;
    } catch (err) {
      err = new Error(
        `Error getting all records from ${table}: ${err.message}`
      );
      throw err;
    } finally {
      if (client) {
        await client.release();
      }
    }
  }
}

module.exports = { DbAccess };
