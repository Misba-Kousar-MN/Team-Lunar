const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoose: {
    url: process.env.MONGO_URI || 'mongodb://localhost:27017/fake-reviews-detector',
    options: {
      // Modern mongoose connection options
    },
  },
  python: {
    path: process.env.PYTHON_PATH || 'python',
    scriptPath: path.join(__dirname, '../python/analyze.py'),
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 mins
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100, // Limit each IP to 100 requests per window
  },
};

module.exports = config;
