const express = require('express');
const { body } = require('express-validator');
const RequestController = require('../controllers/requestController');

const router = express.Router();

router.post('/', [
  body('comments').notEmpty().trim().escape().withMessage('Comments are required.'),
  body('items.*.item_name').notEmpty().trim().escape().withMessage('Item name is required.'),
  body('items.*.item_quantity').isInt({ min: 1 }).withMessage('Item quantity must be at least 1.')
], RequestController.createRequest);

router.get('/', RequestController.getRequests);

module.exports = router;
