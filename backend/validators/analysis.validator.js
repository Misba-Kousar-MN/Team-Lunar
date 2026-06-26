const { body } = require('express-validator');

const analyzeValidator = [
  body('reviews')
    .exists().withMessage('Reviews field is required')
    .isArray({ min: 1 }).withMessage('Reviews must be a non-empty array')
    .custom((value) => {
      if (!Array.isArray(value)) return false;
      return value.every(item => typeof item === 'string' && item.trim().length > 0);
    }).withMessage('All items in the reviews array must be non-empty strings'),
];

module.exports = { analyzeValidator };
