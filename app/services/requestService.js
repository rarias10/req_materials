const Request = require('../models/Request');
const Item = require('../models/Item');

class RequestService {
  // Create a new request and add items
  static async createRequest(user_id, comments, items) {
    const newRequest = await Request.createRequest(user_id, comments);
    await Item.addItemsToRequest(newRequest.request_id, items);
    return newRequest;
  }

  // Get all requests for a specific user
  static async getUserRequests(user_id) {
    return await Request.getUserRequests(user_id);
  }
}

module.exports = RequestService;
