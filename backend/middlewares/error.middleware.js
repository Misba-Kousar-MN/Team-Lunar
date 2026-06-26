const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

// Handles invalid Database ID (e.g. Mongoose CastError)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Handles duplicate fields in database
const handleDuplicateFieldsDB = (err) => {
  // Extract duplicate value from error message
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const matchedValue = value ? value[0] : '';
  const message = `Duplicate field value: ${matchedValue}. Please use another value!`;
  return new AppError(message, 400);
};

// Handles Schema validation failures
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Error formatter for local development (detailed stack details)
const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Error formatter for production (only leak operational messages)
const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak details to user
  logger.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong on the server!',
  });
};

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error using Winston logger
  logger.error(`[Express Error Handler] Status: ${err.statusCode} - Message: ${err.message}`, { stack: err.stack });

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = Object.assign(err);
    error.message = err.message;

    // Handle specific MongoDB errors
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    sendErrorProd(error, req, res);
  }
};

module.exports = { errorMiddleware };
