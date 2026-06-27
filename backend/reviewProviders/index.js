/**
 * Review Provider Factory
 * ───────────────────────────────────────────────────────────────────────
 * Central registry that maps supported e-commerce platforms to their
 * respective review provider modules.
 *
 * Adding a new platform:
 *   1. Create  reviewProviders/<platform>Provider.js
 *   2. Add a hostname entry to PROVIDER_MAP below.
 *   That's it — no other file needs to change.
 */

'use strict';

const amazonProvider  = require('./amazonProvider');
const flipkartProvider = require('./flipkartProvider');

/**
 * Map of supported hostnames → provider module.
 * Keys are matched against URL.hostname (lowercased).
 */
const PROVIDER_MAP = {
  'www.amazon.in':  amazonProvider,
  'amazon.in':      amazonProvider,
  'www.amazon.com': amazonProvider,
  'amazon.com':     amazonProvider,
  'www.amazon.co.uk': amazonProvider,
  'amazon.co.uk':   amazonProvider,

  'www.flipkart.com': flipkartProvider,
  'flipkart.com':     flipkartProvider,
};

/**
 * Supported platform names for error messages.
 */
const SUPPORTED_PLATFORMS = 'Amazon (amazon.in / amazon.com) or Flipkart (flipkart.com)';

/**
 * Validate the URL and return the matching provider.
 *
 * @param {string} rawUrl - The product URL from the request body
 * @returns {{ provider: Object, parsedUrl: URL }}
 * @throws {Error} with .statusCode = 400 if the URL is invalid or unsupported
 */
function resolveProvider(rawUrl) {
  let parsedUrl;

  // 1. Validate that it is a well-formed URL
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    const err = new Error('Invalid URL format. Please provide a complete product URL (e.g. https://www.amazon.in/dp/...).');
    err.statusCode = 400;
    throw err;
  }

  // 2. Must be HTTPS
  if (parsedUrl.protocol !== 'https:') {
    const err = new Error('Only HTTPS URLs are accepted.');
    err.statusCode = 400;
    throw err;
  }

  // 3. Look up the provider
  const hostname = parsedUrl.hostname.toLowerCase();
  const provider = PROVIDER_MAP[hostname];

  if (!provider) {
    const err = new Error(
      `Unsupported platform: "${hostname}". ` +
      `Supported platforms: ${SUPPORTED_PLATFORMS}.`
    );
    err.statusCode = 400;
    throw err;
  }

  return { provider, parsedUrl };
}

/**
 * Fetch reviews for a product URL.
 * Validates the URL, resolves the platform, and delegates to the provider.
 *
 * @param {string} productUrl
 * @returns {Promise<string[]>} Array of review strings
 */
async function getReviewsFromUrl(productUrl) {
  const { provider } = resolveProvider(productUrl);
  const reviews = await provider.getReviews(productUrl);

  if (!Array.isArray(reviews) || reviews.length === 0) {
    const err = new Error('The review provider returned no reviews for this product URL.');
    err.statusCode = 502;
    throw err;
  }

  return reviews;
}

module.exports = { getReviewsFromUrl, resolveProvider, SUPPORTED_PLATFORMS };
