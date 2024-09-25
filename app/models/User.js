const pool = require('../../db/db'); // PostgreSQL pool connection

class User {
  constructor(user_id, name, email, password, role, department) {
    this.user_id = user_id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.department = department;
  }

  // Find a user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM Users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  // Find a user by ID
  static async findById(user_id) {
    const query = 'SELECT * FROM Users WHERE user_id = $1';
    const { rows } = await pool.query(query, [user_id]);
    return rows[0];
  }

  // Create a new user
  static async createUser(name, email, password, role, department) {
    const query = 'INSERT INTO Users (name, email, password, role, department) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const { rows } = await pool.query(query, [name, email, password, role, department]);
    return rows[0];
  }
}

module.exports = User;
