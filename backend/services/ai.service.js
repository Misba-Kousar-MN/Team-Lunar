const { spawn } = require('child_process');
const config = require('../config/config');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

/**
 * Communicates with the Python AI subprocess
 */
class AIService {
  /**
   * Sends reviews to Python subprocess for analysis
   * @param {Array<string>} reviews 
   * @returns {Promise<Array<Object>>}
   */
  async analyzeReviews(reviews) {
    return new Promise((resolve, reject) => {
      const pythonPath = config.python.path;
      const scriptPath = config.python.scriptPath;

      logger.debug(`Spawning Python process: ${pythonPath} ${scriptPath}`);

      const pyProcess = spawn(pythonPath, [scriptPath]);

      let stdoutBuffer = '';
      let stderrBuffer = '';

      // Capture standard output
      pyProcess.stdout.on('data', (data) => {
        stdoutBuffer += data.toString();
      });

      // Capture standard error logs
      pyProcess.stderr.on('data', (data) => {
        stderrBuffer += data.toString();
      });

      // Handle process completion
      pyProcess.on('close', (code) => {
        if (code !== 0) {
          logger.error(`Python script crashed with code ${code}. Error: ${stderrBuffer}`);
          return reject(new AppError('AI Analysis Service failed to execute.', 500));
        }

        try {
          const result = JSON.parse(stdoutBuffer.trim());
          resolve(result);
        } catch (error) {
          logger.error(`Failed to parse Python stdout. Output was: ${stdoutBuffer}`);
          reject(new AppError('Failed to parse AI Analysis results.', 500));
        }
      });

      // Handle process error (e.g. python executable not found)
      pyProcess.on('error', (err) => {
        logger.error(`Failed to start Python subprocess: ${err.message}`);
        reject(new AppError(`AI system failed to start. Ensure Python is configured correctly. Details: ${err.message}`, 500));
      });

      // Write input data to stdin in JSON format and close stream
      pyProcess.stdin.write(JSON.stringify({ reviews }));
      pyProcess.stdin.end();
    });
  }
}

module.exports = new AIService();
