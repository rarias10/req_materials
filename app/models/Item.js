const pool = require('.../../db/db');

class Item {
  constructor(item_id, request_id, item_name, item_quantity, item_type) {
    this.item_id = item_id;
    this.request_id = request_id;
    this.item_name = item_name;
    this.item_quantity = item_quantity;
    this.item_type = item_type;
  }

  // Add items to a request
  static async addItemsToRequest(request_id, items) {
    const itemQueries = items.map(item => {
      return pool.query(
        'INSERT INTO Items (request_id, item_name, item_quantity, item_type) VALUES ($1, $2, $3, $4)',
        [request_id, item.item_name, item.item_quantity, item.item_type]
      );
    });

    await Promise.all(itemQueries);
  }

  // Get items by request ID
  static async getItemsByRequestId(request_id) {
    const query = 'SELECT * FROM Items WHERE request_id = $1';
    const { rows } = await pool.query(query, [request_id]);
    return rows;
  }
}

module.exports = Item;
