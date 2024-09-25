const pool = require('../../db/db');

class Request {
  constructor(request_id, user_id, request_date, status_id, comments) {
    this.request_id = request_id;
    this.user_id = user_id;
    this.request_date = request_date;
    this.status_id = status_id;
    this.comments = comments;
  }

  // Create a new request
  static async createRequest(user_id, comments) {
    const query = 'INSERT INTO Requests (user_id, request_date, status_id, comments) VALUES ($1, NOW(), $2, $3) RETURNING *';
    const { rows } = await pool.query(query, [user_id, 1, comments]); // Default to Pending status (1)
    return rows[0];
  }

  // Fetch all requests by user
  static async getUserRequests(user_id) {
    const query = `
      SELECT r.request_id, r.request_date, r.status_id, s.status_name, r.comments
      FROM Requests r
      JOIN Statuses s ON r.status_id = s.status_id
      WHERE r.user_id = $1
      ORDER BY r.request_id DESC`;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
  }
}

module.exports = Request;
