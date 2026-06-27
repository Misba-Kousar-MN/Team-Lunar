class TrustScoreService {
  /**
   * Calculates overall Trust Score (1.0 - 10.0) and maps to a text recommendation.
   * @param {Object} statistics
   * @param {number} statistics.totalReviews
   * @param {number} statistics.fakeReviews
   * @param {number} statistics.realReviews
   * @param {number} statistics.duplicateReviews
   * @param {number} statistics.genericReviews
   * @param {Array<Object>} analysis List of processed reviews
   * @returns {Object} { trustScore: number, recommendation: string }
   */
  calculateTrustScore(statistics, analysis) {
    const { totalReviews, fakeReviews, duplicateReviews, genericReviews } = statistics;

    if (totalReviews === 0) {
      return {
        trustScore: 10.0,
        recommendation: 'Highly Trustworthy',
      };
    }

    // 1. Calculate ratios for basic factors
    const fakeRatio = fakeReviews / totalReviews;
    const duplicateRatio = duplicateReviews / totalReviews;
    const genericRatio = genericReviews / totalReviews;

    // 2. Extract advanced metrics (Spam, Length, Quality, Diversity, Similarity, Promo Language)
    // Spam review detection (repetition/spam key phrases)
    const spamReviewsCount = analysis.filter(item => 
      item.reason.some(r => /repetition|spam/i.test(r))
    ).length;
    const spamRatio = spamReviewsCount / totalReviews;

    // Review Length Quality (Excessively short review counts)
    const shortReviewsCount = analysis.filter(item => 
      item.reason.some(r => /brief|short/i.test(r))
    ).length;
    const shortRatio = shortReviewsCount / totalReviews;

    // Promotional Language Detection (Generic promotional text check)
    const promoCount = analysis.filter(item => 
      item.reason.some(r => /generic|promo/i.test(r))
    ).length;
    const promoRatio = promoCount / totalReviews;

    // Review Diversity (Unique vs duplicate content ratio)
    const uniqueReviewsCount = totalReviews - duplicateReviews;
    const diversityRatio = uniqueReviewsCount / totalReviews;

    // Detailed Genuine Reviews count (Predicted Real with no quality warnings)
    const detailedGenuineCount = analysis.filter(item => 
      item.prediction === 'Real' && 
      !item.reason.some(r => /brief|short|generic/i.test(r))
    ).length;
    const detailedGenuineRatio = detailedGenuineCount / totalReviews;

    // AI Confidence score (average model confidence)
    let totalConfidence = 0;
    analysis.forEach(item => { totalConfidence += item.confidence; });
    const avgConfidence = totalConfidence / totalReviews;

    // 3. Compute Weighted Penalties (Total deductions from max 10.0)
    // Weights: Fake percentage (5.0 max), Duplicate (1.0 max), Spam (1.0 max), Generic (0.5 max)
    // Review diversity penalty (0.5 max), Length penalty (0.5 max), Semantic similarity cluster (0.5 max), Promo penalty (0.5)
    const fakePenalty = fakeRatio * 5.0;
    const duplicatePenalty = duplicateRatio * 1.0;
    const spamPenalty = spamRatio * 1.0;
    const genericPenalty = genericRatio * 0.5;
    const diversityPenalty = (1.0 - diversityRatio) * 0.5;
    const lengthPenalty = shortRatio * 0.5;
    const similarityPenalty = duplicateRatio * 0.5;
    const promoPenalty = promoRatio * 0.5;

    const totalDeductions = 
      fakePenalty + 
      duplicatePenalty + 
      spamPenalty + 
      genericPenalty + 
      diversityPenalty + 
      lengthPenalty + 
      similarityPenalty + 
      promoPenalty;

    // Calculate raw score (bounds between 1.0 and 10.0 before bonuses)
    const rawScore = Math.max(1.0, 10.0 - totalDeductions);

    // Detailed Genuine reviews add a quality bonus (up to +1.5)
    const genuineBonus = detailedGenuineRatio * 1.5;

    // Final raw calculation using weighted baseline scaling
    let score = rawScore * 0.85 + genuineBonus;

    // AI Confidence adjustments: if AI predictions are low-confidence, shift score slightly towards 5.0 (Mixed)
    if (avgConfidence < 70) {
      const adjustmentWeight = (70 - avgConfidence) / 100; // max 0.7
      score = score * (1 - adjustmentWeight) + 5.0 * adjustmentWeight;
    }

    // 4. Force strict boundaries and round to one decimal place
    score = Math.max(1.0, Math.min(10.0, score));
    const trustScore = Math.round(score * 10) / 10;

    // 5. Mapping Recommendation categories
    let recommendation = 'Mixed Reviews';
    if (trustScore >= 9.0) {
      recommendation = 'Highly Trustworthy';
    } else if (trustScore >= 7.5) {
      recommendation = 'Likely Trustworthy';
    } else if (trustScore >= 5.0) {
      recommendation = 'Mixed Reviews';
    } else if (trustScore >= 3.0) {
      recommendation = 'Suspicious';
    } else {
      recommendation = 'Highly Suspicious';
    }

    return {
      trustScore,
      recommendation,
    };
  }
}

module.exports = new TrustScoreService();
