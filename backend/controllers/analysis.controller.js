/**
 * Analysis Controller
 * ─────────────────────────────────────────────────────────────────────
 * Supports two input modes after validation:
 *
 *   Mode A — Review Array
 *     body.reviews is set → run AI pipeline directly.
 *
 *   Mode B — Product URL
 *     body.productUrl is set → fetch reviews via provider → run AI pipeline.
 *
 * The AI pipeline (analysisService.analyzeReviews) is UNCHANGED.
 * The JSON response shape is UNCHANGED.
 */

'use strict';

const analysisService  = require('../services/analysis.service');
const reviewProviders  = require('../reviewProviders/index');
const AppError         = require('../utils/AppError');
const logger           = require('../utils/logger');

const analyzeReviews = async (req, res, next) => {
  try {
    const { reviews, productUrl } = req.body;

    let reviewsToAnalyze;

    if (productUrl) {
      // ── Mode B: fetch reviews from the product URL ─────────────────
      logger.info(`Product URL mode: fetching reviews for ${productUrl}`);

      try {
        reviewsToAnalyze = await reviewProviders.getReviewsFromUrl(productUrl);
        logger.info(`Provider returned ${reviewsToAnalyze.length} reviews for ${productUrl}`);
      } catch (providerError) {
        // Convert provider errors (statusCode 400 / 502) to AppError
        return next(
          new AppError(
            providerError.message,
            providerError.statusCode || 500
          )
        );
      }

    } else {
      // ── Mode A: use the reviews array directly ─────────────────────
      reviewsToAnalyze = reviews;
    }

    // ── Run the unchanged AI pipeline ──────────────────────────────────
    const analysisResult = await analysisService.analyzeReviews(reviewsToAnalyze);

    // Attach source metadata to the response (does not change existing fields)
    const responsePayload = {
      ...analysisResult,
      source: productUrl
        ? { type: 'url', productUrl }
        : { type: 'manual' },
    };

    res.status(200).json(responsePayload);

  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeReviews };
