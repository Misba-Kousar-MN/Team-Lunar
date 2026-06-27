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
const apifyService     = require('../services/apify.service');
const AppError         = require('../utils/AppError');
const logger           = require('../utils/logger');

const analyzeReviews = async (req, res, next) => {
  try {
    const { reviews, productUrl } = req.body;

    let reviewsToAnalyze;
    let liveProduct = null;

    if (productUrl) {
      // ── Mode B: fetch reviews and product info ─────────────────────
      logger.info(`Product URL mode: attempting live Apify pull for ${productUrl}`);

      try {
        liveProduct = await apifyService.fetchLiveProduct(productUrl);
      } catch (apifyError) {
        logger.warn(`[AnalysisController] Apify service error: ${apifyError.message}`);
      }

      if (liveProduct) {
        logger.info(`[AnalysisController] Apify success. Scraped ${liveProduct.reviews.length} reviews.`);
        reviewsToAnalyze = liveProduct.reviews;
      } else {
        logger.info(`[AnalysisController] Apify failed/unavailable. Falling back to DB/mock provider.`);
        try {
          reviewsToAnalyze = await reviewProviders.getReviewsFromUrl(productUrl);
          logger.info(`Provider returned ${reviewsToAnalyze.length} reviews for fallback.`);
        } catch (providerError) {
          return next(
            new AppError(
              providerError.message,
              providerError.statusCode || 500
            )
          );
        }
      }

    } else {
      // ── Mode A: use the reviews array directly ─────────────────────
      reviewsToAnalyze = reviews;
    }

    // ── Run the AI pipeline with optional live product meta ────────────
    const analysisResult = await analysisService.analyzeReviews(reviewsToAnalyze, liveProduct);

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
