const aiService = require('./ai.service');
const trustScoreService = require('./trustScore.service');
const AnalysisHistory = require('../models/analysis.model');
const logger = require('../utils/logger');

class AnalysisService {
  /**
   * Orchestrates the review analysis process
   * @param {Array<string>} reviews 
   * @returns {Promise<Object>} The calculated analysis payload
   */
  async analyzeReviews(reviews) {
    logger.info(`Starting analysis for ${reviews.length} reviews`);

    // 1. Call AI subprocess service
    const rawAiResults = await aiService.analyzeReviews(reviews);

    // 2. Count statistics based on AI results
    let fakeReviewsCount = 0;
    let realReviewsCount = 0;
    let duplicateCount = 0;
    let genericCount = 0;

    const analysisList = rawAiResults.map(item => {
      if (item.prediction === 'Fake') {
        fakeReviewsCount++;
      } else {
        realReviewsCount++;
      }

      if (item.is_duplicate) {
        duplicateCount++;
      }

      if (item.is_generic) {
        genericCount++;
      }

      // Format individual review payload matching database schema and API spec
      return {
        review: item.review,
        prediction: item.prediction,
        confidence: Math.round(item.confidence),
        reason: item.reason || [],
      };
    });

    const statistics = {
      totalReviews: reviews.length,
      fakeReviews: fakeReviewsCount,
      realReviews: realReviewsCount,
      duplicateReviews: duplicateCount,
      genericReviews: genericCount,
    };

    // 3. Calculate Trust Score and Recommendation
    const { trustScore, recommendation } = trustScoreService.calculateTrustScore(statistics, analysisList);

    // 4. Save to MongoDB AnalysisHistory
    const analysisHistory = new AnalysisHistory({
      originalReviews: reviews,
      trustScore,
      recommendation,
      statistics,
      analysis: analysisList,
    });

    await analysisHistory.save();
    logger.info(`Successfully processed and saved analysis history. ID: ${analysisHistory._id}`);

    // 5. Return formatted JSON response matching specifications
    return {
      trustScore,
      recommendation,
      statistics,
      analysis: analysisList,
    };
  }
}

module.exports = new AnalysisService();
