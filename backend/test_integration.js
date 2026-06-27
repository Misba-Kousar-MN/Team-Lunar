const mongoose = require('mongoose');
const path = require('path');

// Ensure proper environment loading
require('dotenv').config({ path: path.join(__dirname, '.env') });

const config = require('./config/config');
const connectDB = require('./config/db');
const analysisService = require('./services/analysis.service');
const logger = require('./utils/logger');
const AnalysisHistory = require('./models/analysis.model');

const testReviews = [
  "This product is amazing! The build quality is top-notch, battery lasts all day, and screen is beautiful.", // Natural real review
  "This product is amazing! The build quality is top-notch, battery lasts all day, and screen is beautiful.", // Semantic near-duplicate
  "very nice product", // Generic short review
  "worst quality buy buy buy buy buy buy buy bad bad bad bad bad bad bad bad buy buy buy bad bad bad", // Keyword repetition
  "This is a great product, highly recommended, very nice, excellent product", // Generic praise
  "worst garbage product" // Extreme negative short review
];

const runTest = async () => {
  logger.info('--- Starting Integration Test ---');
  
  try {
    // 1. Connect to Database
    await connectDB();
    
    // 2. Clear previous test histories
    await AnalysisHistory.deleteMany({ originalReviews: { $in: [testReviews[0]] } });
    logger.info('Cleaned up previous test records.');

    // 3. Trigger analysis
    logger.info('Running AI review analysis pipeline...');
    const result = await analysisService.analyzeReviews(testReviews);

    // 4. Verify results
    logger.info('Integration Test Result Output:');
    console.log(JSON.stringify(result, null, 2));

    // 5. Assertions
    if (typeof result.trustScore !== 'number' || result.trustScore < 1.0 || result.trustScore > 10.0) {
      throw new Error(`Assertion Failed: Invalid trustScore: ${result.trustScore}`);
    }
    
    if (!result.recommendation) {
      throw new Error('Assertion Failed: Missing recommendation label');
    }

    if (result.statistics.totalReviews !== testReviews.length) {
      throw new Error(`Assertion Failed: Expected ${testReviews.length} reviews, got ${result.statistics.totalReviews}`);
    }

    // Check individual review classifications
    logger.info('Checking individual reviews:');
    result.analysis.forEach((analysis, idx) => {
      logger.info(`Review #${idx + 1} prediction: [${analysis.prediction}] (Confidence: ${analysis.confidence}%)`);
      logger.info(`Reasons: ${analysis.reason.join(', ')}`);
    });

    // 6. Verify MongoDB record storage
    const savedRecord = await AnalysisHistory.findOne({ originalReviews: { $all: testReviews } });
    if (!savedRecord) {
      throw new Error('Assertion Failed: Analysis history record was not saved in MongoDB!');
    }
    logger.info(`Verified database record storage. Record ID: ${savedRecord._id}`);

    // 7. Verify History Controller endpoints
    const historyController = require('./controllers/history.controller');
    
    // Mock express response object
    const mockRes = {
      statusCode: 200,
      jsonPayload: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.jsonPayload = payload;
        return this;
      }
    };
    
    logger.info('Testing GET /api/history...');
    await historyController.getHistories({}, mockRes, (err) => { if (err) throw err; });
    
    const results = mockRes.jsonPayload.data;
    logger.info(`GET /api/history returned ${results.length} records.`);
    
    if (results.length === 0) {
      throw new Error('Assertion Failed: getHistories returned 0 records!');
    }
    
    const targetId = results[0]._id;
    logger.info(`Testing GET /api/history/${targetId}...`);
    
    const mockReqGet = { params: { id: targetId.toString() } };
    await historyController.getHistoryById(mockReqGet, mockRes, (err) => { if (err) throw err; });
    
    if (!mockRes.jsonPayload.data) {
      throw new Error('Assertion Failed: getHistoryById returned null!');
    }
    logger.info(`GET /api/history/${targetId} retrieved successfully.`);
    
    // Testing Delete
    logger.info(`Testing DELETE /api/history/${targetId}...`);
    const mockResDelete = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        return this;
      }
    };
    const mockReqDelete = { params: { id: targetId.toString() } };
    await historyController.deleteHistory(mockReqDelete, mockResDelete, (err) => { if (err) throw err; });
    
    if (mockResDelete.statusCode !== 204) {
      throw new Error(`Assertion Failed: deleteHistory returned status ${mockResDelete.statusCode}`);
    }
    logger.info(`DELETE /api/history/${targetId} passed (Status 204).`);

    logger.info('--- Integration Test PASSED successfully! ---');
  } catch (error) {
    logger.error(`Integration Test FAILED: ${error.message}`);
    console.error(error);
  } finally {
    // Disconnect DB to allow script to exit
    await mongoose.disconnect();
    logger.info('Database disconnected. Exiting test.');
  }
};

runTest();
