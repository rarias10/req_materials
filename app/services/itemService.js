const Item = require('../models/Item');

class ItemService {
  // Add items to a specific request
  static async addItemsToRequest(request_id, items) {
    return await Item.addItemsToRequest(request_id, items);
  }

  // Get items for a specific request
  static async getItemsByRequestId(request_id) {
    return await Item.getItemsByRequestId(request_id);
  }
}

module.exports = ItemService;
