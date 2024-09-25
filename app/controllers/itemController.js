const ItemService = require('../services/itemService');
const { validationResult } = require('express-validator');

class ItemController {
  // Add items to a request
  static async addItemsToRequest(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { request_id, items } = req.body;

    try {
      await ItemService.addItemsToRequest(request_id, items);
      return res.status(201).json({ message: 'Items added successfully' });
    } catch (error) {
      console.error('Error adding items:', error);
      return res.status(500).json({ message: 'Error adding items.' });
    }
  }

  // Get items for a specific request
  static async getItemsByRequest(req, res) {
    const { request_id } = req.params;

    try {
      const items = await ItemService.getItemsByRequestId(request_id);
      if (items.length === 0) {
        return res.status(404).json({ message: 'No items found for this request' });
      }
      return res.status(200).json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      return res.status(500).json({ message: 'Error fetching items.' });
    }
  }
}

module.exports = ItemController;
