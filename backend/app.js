const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const logger = require('./utils/logger');
const AppError = require('./utils/AppError');
const { errorMiddleware } = require('./middlewares/error.middleware');

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. CORS setup
app.use(cors({
  origin: '*', // Hackathon setting. Change to specific domain in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 3. Request Logging
const morganFormat = config.env === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  stream: { write: (message) => logger.info(message.trim()) },
}));

// 4. Rate Limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

if (config.env === 'production') {
  app.use('/api', limiter);
}

// 5. Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'System is healthy',
    timestamp: new Date(),
  });
});

// 7. API Routes Setup (will import route here once defined)
app.use('/api', require('./routes/analysis.route'));
app.use('/api/history', require('./routes/history.route'));

// 8. 404 Route handler
app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 9. Centralized Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
