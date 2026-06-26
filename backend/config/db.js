const mongoose = require('mongoose');
const config = require('./config');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const dbUrl = config.mongoose.url;
    logger.info(`Attempting to connect to MongoDB at: ${dbUrl.replace(/:([^@]+)@/, ':****@')}`); // Hide passwords in log

    const connectionOptions = {
      // Add custom options if needed (e.g. serverSelectionTimeoutMS)
      serverSelectionTimeoutMS: 5000,
    };

    const conn = await mongoose.connect(dbUrl, connectionOptions);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Database connection error: ${error.message}`);
    // Shut down server if database cannot be connected on startup
    process.exit(1);
  }

  // Handle runtime connection issues
  mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected! Attempting to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected!');
  });
};

module.exports = connectDB;
