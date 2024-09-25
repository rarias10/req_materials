const UserService = require('../services/userService');
const { validationResult } = require('express-validator');

class UserController {
  // Get user profile
  static async getUserProfile(req, res) {
    const user_id = req.user.user_id;
    try {
      const user = await UserService.findById(user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ message: 'Error fetching user profile.' });
    }
  }

  // Update user profile
  static async updateUserProfile(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user_id = req.user.user_id;
    const { email, password } = req.body;

    try {
      const updatedData = {
        email,
        password: password ? await bcrypt.hash(password, 10) : undefined,
      };

      const updatedUser = await UserService.updateUser(user_id, updatedData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({ message: 'Error updating user profile.' });
    }
  }
}

module.exports = UserController;
