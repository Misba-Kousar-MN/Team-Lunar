'use strict';

/**
 * trust.service.js
 * ──────────────────────────────────────────────────────────────────────────
 * Node.js bridge that spawns trust_engine.py as a subprocess to evaluate
 * the Explainable Shopping Trust Score & Confidence.
 *
 * DESIGN:
 *   - Follows the spawn subprocess stdin/stdout pattern.
 *   - Gracefully intercepts failures and returns null instead of throwing.
 * ──────────────────────────────────────────────────────────────────────────
 */

const { spawn } = require('child_process');
const path      = require('path');
const config    = require('../config/config');
const logger    = require('../utils/logger');

class TrustService {
  constructor() {
    this.scriptPath = path.join(
      path.dirname(config.python.scriptPath),
      'trust_engine.py'
    );
    this.pythonPath = config.python.path;
  }

  /**
   * Spawns trust_engine.py to evaluate trust scores.
   *
   * @param {string[]} reviews    — Raw review content array
   * @param {Object}   statistics — Statistics from neural classifier
   * @param {string}   platform   — Platform name (Amazon, Flipkart, etc.)
   * @param {Object}   priceInfo  — Price details (current, reference)
   * @returns {Promise<Object|null>}
   */
  async evaluate(reviews, statistics, platform = 'Unknown', priceInfo = {}) {
    return new Promise((resolve) => {
      logger.debug(`[TrustService] Spawning trust engine: ${this.pythonPath} ${this.scriptPath}`);

      let pyProcess;
      try {
        pyProcess = spawn(this.pythonPath, [this.scriptPath]);
      } catch (err) {
        logger.warn(`[TrustService] Failed to spawn trust engine process: ${err.message}`);
        return resolve(null);
      }

      let stdoutBuffer = '';
      let stderrBuffer = '';

      pyProcess.stdout.on('data', (data) => {
        stdoutBuffer += data.toString();
      });

      pyProcess.stderr.on('data', (data) => {
        stderrBuffer += data.toString();
      });

      pyProcess.on('close', (code) => {
        if (code !== 0) {
          logger.warn(`[TrustService] Subprocess exited with code ${code}. stderr: ${stderrBuffer}`);
          return resolve(null);
        }

        try {
          const result = JSON.parse(stdoutBuffer.trim());
          if (
            typeof result.product_trust_score !== 'number' ||
            typeof result.overall_shopping_confidence !== 'number'
          ) {
            logger.warn('[TrustService] Invalid output structure.');
            return resolve(null);
          }
          resolve(result);
        } catch (e) {
          logger.warn(`[TrustService] Failed to parse output: ${stdoutBuffer}`);
          resolve(null);
        }
      });

      pyProcess.on('error', (err) => {
        logger.warn(`[TrustService] Subprocess error: ${err.message}`);
        resolve(null);
      });

      const payload = JSON.stringify({
        reviews,
        statistics,
        platform,
        price_info: priceInfo
      });

      pyProcess.stdin.write(payload);
      pyProcess.stdin.end();
    });
  }
}

module.exports = new TrustService();
