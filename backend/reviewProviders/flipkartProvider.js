/**
 * Flipkart Review Provider
 * ───────────────────────────────────────────────────────────────────────
 * In production, replace the mock data below with a real API call or
 * a headless-browser scraper (e.g. Playwright targeting Flipkart's
 * public review pages).
 *
 * Contract: getReviews(productUrl: string) → Promise<string[]>
 *   Returns an array of review strings ready for the AI pipeline.
 */

'use strict';

/**
 * Attempt to extract a Flipkart product slug / pid from the URL.
 * Flipkart URLs typically look like:
 *   /product-name/p/itm<PID>
 */
function extractProductId(productUrl) {
  const m = productUrl.match(/\/p\/(itm[a-z0-9]+)/i);
  return m ? m[1] : null;
}

/**
 * Returns a pool of structured mock reviews for a Flipkart product.
 * The pool is intentionally mixed to exercise all AI pipeline checks.
 *
 * Replace this function body with a real API call when available.
 */
async function getReviews(productUrl) {
  const pid = extractProductId(productUrl);

  const mockReviews = [
    // Detailed, genuine reviews
    "Ordered this during the Big Billion Days sale and the experience has been great. The product matches the description exactly. Delivery was prompt and the packaging was secure. I've recommended it to two colleagues already.",
    "Value for money purchase. I was skeptical at first because of the price, but it's been in use for two months with no issues. The material feels premium and the size is just right for daily use.",
    "Good product overall. A few minor inconsistencies with the colour shown in photos vs actual, but the functionality is excellent. Customer support resolved my query within 4 hours.",

    // Duplicate reviews (should be caught)
    "best product on flipkart",
    "best product on flipkart highly recommended",

    // Generic / meaningless reviews
    "ok product",
    "average",
    "fine",

    // Suspicious / overly promotional
    "SUPERB!! MIND BLOWING!! EVERYONE BUY THIS NOW!! BEST IN INDIA!! NO COMPARISON!!",
    "Excellent excellent excellent! 10/10! Perfect! Buy immediately! Zero defects! Amazing!",

    // Spam / keyword repetition
    "flipkart best deal discount offer sale buy now lowest price best price buy buy buy offer offer",
  ];

  return mockReviews;
}

module.exports = { getReviews, extractProductId };
