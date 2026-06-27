/**
 * Analysis Request Validator
 * ─────────────────────────────────────────────────────────────────────
 * Accepts ONE of two mutually-exclusive input modes:
 *
 *   Mode A — Review Array
 *     { "reviews": ["Review 1", "Review 2", ...] }
 *
 *   Mode B — Product URL
 *     { "productUrl": "https://www.amazon.in/dp/B09XYZ123" }
 *
 * Exactly one of the two must be present; providing both or neither is a 400.
 */

'use strict';

const { body } = require('express-validator');

const analyzeValidator = [
  // ── Mutual-exclusion guard ────────────────────────────────────────────
  body()
    .custom((_, { req }) => {
      const hasReviews    = req.body.reviews    !== undefined;
      const hasProductUrl = req.body.productUrl !== undefined;

      if (!hasReviews && !hasProductUrl) {
        throw new Error(
          'Request must include either "reviews" (array of strings) ' +
          'or "productUrl" (Amazon / Flipkart product page URL).'
        );
      }

      if (hasReviews && hasProductUrl) {
        throw new Error(
          'Provide either "reviews" or "productUrl", not both.'
        );
      }

      return true;
    }),

  // ── Mode A: reviews array ─────────────────────────────────────────────
  body('reviews')
    .optional()
    .isArray({ min: 1 })
    .withMessage('reviews must be a non-empty array')
    .custom((value) => {
      if (!Array.isArray(value)) return true; // handled by isArray above
      const allStrings = value.every(
        (item) => typeof item === 'string' && item.trim().length > 0
      );
      if (!allStrings) {
        throw new Error('All items in the reviews array must be non-empty strings.');
      }
      return true;
    }),

  // ── Mode B: product URL ───────────────────────────────────────────────
  body('productUrl')
    .optional()
    .isString()
    .withMessage('productUrl must be a string')
    .isURL({ protocols: ['https'], require_protocol: true })
    .withMessage('productUrl must be a valid HTTPS URL'),
];

module.exports = { analyzeValidator };
