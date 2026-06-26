const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysis.controller');
const { analyzeValidator } = require('../validators/analysis.validator');
const { validate } = require('../middlewares/validation.middleware');

router.post('/analyze', analyzeValidator, validate, analysisController.analyzeReviews);

module.exports = router;
