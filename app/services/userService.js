const bcrypt = require('bcrypt');
const User = require('../models/User');

class UserService {
  // Register a new user
  static async registerUser(name, email, password, role, department) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.createUser(name, email, hashedPassword, role, department);
  }

  // Find a user by email
  static async findByEmail(email) {
    return await User.findByEmail(email);
  }

  // Find a user by ID
  static async findById(user_id) {
    return await User.findById(user_id);
  }
}

module.exports = UserService;
