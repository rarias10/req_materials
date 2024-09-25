const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/authController'); // Correct import

const router = express.Router();

router.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
], AuthController.login); // Use AuthController here

router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty(),
  body('role').isIn(['Teacher', 'Administrator'])
], AuthController.register); // Use AuthController here

router.post('/logout', AuthController.logout); // Use AuthController here

module.exports = router;
