/**
 * Amazon Review Provider
 * ───────────────────────────────────────────────────────────────────────
 * In production, replace the mock data below with a real API call (e.g.
 * Rainforest API, ScraperAPI, or a custom Playwright-based scraper).
 *
 * Contract: getReviews(productUrl: string) → Promise<string[]>
 *   Returns an array of review strings ready for the AI pipeline.
 */

'use strict';

/**
 * Extract an ASIN from a variety of Amazon URL patterns:
 *   /dp/ASIN
 *   /gp/product/ASIN
 *   /ASIN (some short links)
 */
function extractAsin(productUrl) {
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /\/product\/([A-Z0-9]{10})/i,
  ];
  for (const re of patterns) {
    const m = productUrl.match(re);
    if (m) return m[1];
  }
  return null;
}

/**
 * Returns a pool of structured mock reviews that realistically represent
 * a mixed Amazon product listing (some genuine, some fake/duplicate/generic).
 *
 * Replace this function body with a real API call when available.
 */
async function getReviews(productUrl) {
  const asin = extractAsin(productUrl);

  // Realistic, varied mock review pool — suitable for full AI pipeline demo
  const mockReviews = [
    // Genuine, detailed reviews
    "I've been using this product for about three months now and I'm genuinely impressed. The build quality is solid, the performance is consistent, and it does exactly what it promises. Setup took less than 10 minutes. Minor quibble: the manual could be clearer.",
    "After reading dozens of reviews I decided to take the plunge. No regrets whatsoever. It's exactly as described, packaging was pristine, and delivery arrived two days early. Works perfectly with my existing setup.",
    "Bought this as a replacement for an older model. The improvement in performance is noticeable from day one. Battery life is excellent — easily lasts through a full workday. The only downside is it runs slightly warm under heavy load.",
    "Solid product at a fair price point. I compared several alternatives before choosing this one and the specs justified the decision. Used it daily for 6 weeks now with zero issues.",

    // Duplicate / near-duplicate reviews (should be flagged)
    "great product very happy",
    "great product very happy with purchase",

    // Generic / low-information reviews
    "nice product",
    "good",
    "ok",

    // Overly positive / suspicious
    "BEST PRODUCT EVER BOUGHT IN MY ENTIRE LIFE!! AMAZING AMAZING AMAZING!! BUY NOW YOU WONT REGRET!!",
    "Perfect perfect perfect!! Five stars!! Must buy!! Outstanding quality!!",

    // Spam / keyword-stuffed
    "buy this product best product cheap product quality product fast shipping best deal buy buy buy top product",
  ];

  return mockReviews;
}

module.exports = { getReviews, extractAsin };
