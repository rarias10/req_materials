const passport = require('passport');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const UserService = require('../services/userService');

class AuthController {
  // Handle login request
  static login(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json({ message: 'Login successful', user });
      });
    })(req, res, next);
  }

  // Handle logout request
  static logout(req, res) {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.status(200).json({ message: 'Logout successful' });
    });
  }

  // Check if user is authenticated
  static checkSession(req, res) {
    if (req.isAuthenticated()) {
      res.status(200).json({ message: 'Session is active', user: req.user });
    } else {
      res.status(401).json({ message: 'No active session' });
    }
  }

  // Register a new user
  static async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, role } = req.body;

    try {
      const existingUser = await UserService.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserService.createUser({ email, password: hashedPassword, name, role });
      return res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ message: 'Error registering user.' });
    }
  }
}

module.exports = AuthController;
