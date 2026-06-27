'use strict';

/**
 * apify.service.js
 * ──────────────────────────────────────────────────────────────────────────
 * Node.js bridge that spawns apify_service.py as a subprocess to fetch
 * live product reviews and metadata via Apify API actors.
 *
 * Implements strict 5-second execution timeout and in-memory query caching.
 * ──────────────────────────────────────────────────────────────────────────
 */

const { spawn } = require('child_process');
const path      = require('path');
const config    = require('../config/config');
const logger    = require('../utils/logger');

class ApifyService {
  constructor() {
    this.scriptPath = path.join(
      path.dirname(config.python.scriptPath),
      'apify_service.py'
    );
    this.pythonPath = config.python.path;
    this.cache = new Map(); // In-memory cache for recent queries
    this.cacheTtl = 3600000; // Cache TTL: 1 Hour
  }

  /**
   * Spawns apify_service.py to scrape product metadata and reviews.
   *
   * @param {string} productUrl
   * @returns {Promise<Object|null>} Standardized JSON layout or null on timeout/error.
   */
  async fetchLiveProduct(productUrl) {
    if (!productUrl) return null;
    
    const cacheKey = productUrl.trim().toLowerCase();
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTtl) {
      logger.info(`[ApifyService] Cache hit for URL: ${productUrl}`);
      return cached.data;
    }

    return new Promise((resolve) => {
      logger.info(`[ApifyService] Spawning apify scraper: ${this.pythonPath} ${this.scriptPath} for URL: ${productUrl}`);

      let pyProcess;
      try {
        pyProcess = spawn(this.pythonPath, [this.scriptPath, productUrl]);
      } catch (err) {
        logger.error(`[ApifyService] Failed to spawn subprocess: ${err.message}`);
        return resolve(null);
      }

      let stdoutBuffer = '';
      let stderrBuffer = '';

      // Force strict 5 second maximum timeout to guarantee immediate response/fallback
      const timeoutId = setTimeout(() => {
        logger.warn(`[ApifyService] Execution timed out (>5s) for ${productUrl}. Killing subprocess.`);
        try {
          pyProcess.kill('SIGKILL');
        } catch (killErr) {
          logger.debug(`[ApifyService] Process kill warning: ${killErr.message}`);
        }
        resolve(null);
      }, 5000);

      pyProcess.stdout.on('data', (data) => {
        stdoutBuffer += data.toString();
      });

      pyProcess.stderr.on('data', (data) => {
        stderrBuffer += data.toString();
      });

      pyProcess.on('close', (code) => {
        clearTimeout(timeoutId);

        if (code !== 0) {
          logger.warn(`[ApifyService] Subprocess exited with code ${code}. stderr: ${stderrBuffer}`);
          return resolve(null);
        }

        try {
          const result = JSON.parse(stdoutBuffer.trim());
          if (result && result.isLive) {
            // Store successful result in cache
            this.cache.set(cacheKey, {
              timestamp: Date.now(),
              data: result
            });
            resolve(result);
          } else {
            logger.warn(`[ApifyService] Scrape failed. Reason: ${result ? result.reason : 'unknown'}`);
            resolve(null);
          }
        } catch (e) {
          logger.error(`[ApifyService] Failed to parse JSON stdout: ${stdoutBuffer}. Error: ${e.message}`);
          resolve(null);
        }
      });

      pyProcess.on('error', (err) => {
        clearTimeout(timeoutId);
        logger.error(`[ApifyService] Subprocess execution error: ${err.message}`);
        resolve(null);
      });
    });
  }
}

module.exports = new ApifyService();
