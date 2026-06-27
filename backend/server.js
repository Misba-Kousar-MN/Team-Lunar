const app = require('./app');
const config = require('./config/config');
const logger = require('./utils/logger');
const connectDB = require('./config/db');

// Handle uncaught exceptions globally
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err);
  process.exit(1);
});

// Establish MongoDB connection
connectDB();

const server = app.listen(config.port, () => {
  logger.info(`Server is running in ${config.env} mode on port ${config.port}`);
});

// Graceful handling for port-in-use conflicts (EADDRINUSE).
// This prevents the raw uncaught exception crash and prints a clear diagnostic.
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(
      `Port ${config.port} is already in use. ` +
      `Kill the existing process before starting again. ` +
      `Run: npx kill-port ${config.port}`
    );
    process.exit(1);
  } else {
    throw err; // Re-throw unexpected errors
  }
});

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM (e.g. system shutdown, deployment changes)
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});
