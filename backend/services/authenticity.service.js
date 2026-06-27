'use strict';

/**
 * authenticity.service.js
 * ──────────────────────────────────────────────────────────────────────────
 * Node.js bridge that spawns authenticity_engine.py as a subprocess.
 *
 * DESIGN:
 *   - Mirrors the exact pattern used by ai.service.js (spawn + stdin/stdout)
 *   - Never throws to its caller — returns null on any failure
 *   - Completely independent of ai.service.js and the existing analysis pipeline
 *   - Called ONLY from analysis.service.js after the existing pipeline completes
 * ──────────────────────────────────────────────────────────────────────────
 */

const { spawn } = require('child_process');
const path      = require('path');
const config    = require('../config/config');
const logger    = require('../utils/logger');

class AuthenticityService {
  constructor() {
    // Path to the new engine script (same directory as analyze.py)
    this.scriptPath = path.join(
      path.dirname(config.python.scriptPath),
      'authenticity_engine.py'
    );
    this.pythonPath = config.python.path;
  }

  /**
   * Evaluates product risk using the standalone Python heuristic engine.
   *
   * @param {string[]} reviews    — Raw review texts (same array the AI pipeline used)
   * @param {Object}   statistics — Statistics object from the existing pipeline result
   * @returns {Promise<Object|null>} Engine result or null if engine is unavailable
   */
  async evaluate(reviews, statistics) {
    return new Promise((resolve) => {
      logger.debug(`[AuthenticityService] Spawning engine: ${this.pythonPath} ${this.scriptPath}`);

      let pyProcess;

      try {
        pyProcess = spawn(this.pythonPath, [this.scriptPath]);
      } catch (spawnErr) {
        // Python not found or script path wrong — fail silently
        logger.warn(`[AuthenticityService] Failed to spawn Python process: ${spawnErr.message}`);
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
          logger.warn(`[AuthenticityService] Engine exited with code ${code}. stderr: ${stderrBuffer.substring(0, 300)}`);
          return resolve(null);  // Silent fail — existing response unaffected
        }

        try {
          const result = JSON.parse(stdoutBuffer.trim());

          // Validate the result has expected keys before passing to frontend
          if (
            typeof result.seller_credibility_score  !== 'number' ||
            typeof result.product_authenticity_score !== 'number'
          ) {
            logger.warn('[AuthenticityService] Engine returned unexpected structure — skipping.');
            return resolve(null);
          }

          logger.debug(`[AuthenticityService] Engine completed. SellerScore=${result.seller_credibility_score}, AuthScore=${result.product_authenticity_score}`);
          resolve(result);

        } catch (parseErr) {
          logger.warn(`[AuthenticityService] Failed to parse engine stdout: ${stdoutBuffer.substring(0, 200)}`);
          resolve(null);  // Silent fail
        }
      });

      pyProcess.on('error', (err) => {
        logger.warn(`[AuthenticityService] Subprocess error: ${err.message}`);
        resolve(null);  // Silent fail — never rejects
      });

      // Send input payload via stdin
      const payload = JSON.stringify({ reviews, statistics });
      pyProcess.stdin.write(payload);
      pyProcess.stdin.end();
    });
  }
}

module.exports = new AuthenticityService();
