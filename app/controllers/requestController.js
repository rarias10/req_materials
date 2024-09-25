const RequestService = require('../services/requestService');
const { validationResult } = require('express-validator');

class RequestController {
  // Create a new request
  static async createRequest(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { comments, items } = req.body;
    const user_id = req.user.user_id;

    try {
      const newRequest = await RequestService.createRequest(user_id, comments, items);
      return res.status(201).json(newRequest);
    } catch (error) {
      console.error('Error creating request:', error);
      return res.status(500).json({ message: 'Error creating request.' });
    }
  }

  // Get all requests for the authenticated user
  static async getRequests(req, res) {
    const user_id = req.user.user_id;
    try {
      const requests = await RequestService.getUserRequests(user_id);
      if (requests.length === 0) {
        return res.status(404).json({ message: 'No requests found' });
      }
      return res.status(200).json(requests);
    } catch (error) {
      console.error('Error fetching user requests:', error);
      return res.status(500).json({ message: 'Error fetching user requests.' });
    }
  }
}

module.exports = RequestController;
