const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controller');
const { param } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');

// Validator to ensure ID parameter is a valid MongoDB ObjectId
const mongoIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid database ID format'),
];

router.get('/', historyController.getHistories);
router.get('/:id', mongoIdValidator, validate, historyController.getHistoryById);
router.delete('/:id', mongoIdValidator, validate, historyController.deleteHistory);

module.exports = router;
