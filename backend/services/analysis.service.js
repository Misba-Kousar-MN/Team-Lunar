const aiService          = require('./ai.service');
const trustScoreService  = require('./trustScore.service');
const authenticityService = require('./authenticity.service'); // NEW — standalone engine
const trustService        = require('./trust.service');        // NEW — ESTE engine
const AnalysisHistory    = require('../models/analysis.model');
const logger             = require('../utils/logger');

function getProductMetadata(reviews) {
  if (!reviews || reviews.length === 0) return { platform: 'Unknown', priceInfo: { current: 0, reference: 0 } };
  const first = reviews[0].toLowerCase();
  
  if (first.includes('iphone') || first.includes('a19') || first.includes('thinnest')) {
    return { platform: 'Amazon', priceInfo: { current: 89900, reference: 89900 } };
  }
  if (first.includes('m3') || first.includes('macbook') || first.includes('docker')) {
    return { platform: 'Amazon', priceInfo: { current: 114900, reference: 114900 } };
  }
  if (first.includes('633l') || first.includes('refrigerator') || first.includes('dispenser') || first.includes('plumbed')) {
    return { platform: 'Amazon', priceInfo: { current: 124900, reference: 124900 } };
  }
  if (first.includes('ecobubble') || first.includes('washing') || first.includes('ww12')) {
    return { platform: 'Amazon', priceInfo: { current: 44900, reference: 44900 } };
  }
  if (first.includes('eos r50') || first.includes('camera') || first.includes('rf-s') || first.includes('lens')) {
    return { platform: 'Amazon', priceInfo: { current: 50900, reference: 50900 } };
  }
  if (first.includes('oled') || first.includes('television') || first.includes('dolby') || first.includes('webos')) {
    return { platform: 'Amazon', priceInfo: { current: 119900, reference: 119900 } };
  }
  if (first.includes('dishwasher') || first.includes('kadhai') || first.includes('dfb424fp')) {
    return { platform: 'Flipkart', priceInfo: { current: 54900, reference: 54900 } };
  }
  if (first.includes('ipad') || first.includes('a13') || first.includes('tablet')) {
    return { platform: 'Flipkart', priceInfo: { current: 32900, reference: 32900 } };
  }
  if (first.includes('sofa') || first.includes('duroflex') || first.includes('cushion') || first.includes('seating') || first.includes('fabric')) {
    return { platform: 'Flipkart', priceInfo: { current: 18900, reference: 18900 } };
  }
  
  return { platform: 'Amazon', priceInfo: { current: 9990, reference: 9990 } };
}

class AnalysisService {
  /**
   * Orchestrates the review analysis process
   * @param {Array<string>} reviews 
   * @returns {Promise<Object>} The calculated analysis payload
   */
  async analyzeReviews(reviews, liveMeta = null) {
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

    // 5. Build the existing response object (UNCHANGED shape)
    const existingResult = {
      trustScore,
      recommendation,
      statistics,
      analysis: analysisList,
    };

    // 7. Run the new Authenticity Engine in parallel (NON-BLOCKING, SAFE)
    //    If it throws or returns null for any reason, existing result is returned as-is.
    let authenticityEngine = null;
    try {
      authenticityEngine = await authenticityService.evaluate(reviews, statistics);
    } catch (err) {
      // Intentionally silent — engine failure must never affect existing functionality
      logger.warn('[AnalysisService] AuthenticityEngine failed silently — skipping field: ' + err.message);
    }

    // 8. Run the new ESTE Trust Engine in parallel (NON-BLOCKING, SAFE)
    let trustEngine = null;
    try {
      const meta = liveMeta 
        ? { 
            platform: liveMeta.marketplace, 
            priceInfo: { current: liveMeta.currentPrice, reference: liveMeta.originalPrice } 
          } 
        : getProductMetadata(reviews);
      
      // Calculate avg AI confidence from statistics context for trust_engine.py
      let totalConfidence = 0;
      analysisList.forEach(item => { totalConfidence += item.confidence; });
      const avgConfidence = analysisList.length > 0 ? totalConfidence / analysisList.length : 85;
      
      const statsPayload = {
        ...statistics,
        avgConfidence
      };

      trustEngine = await trustService.evaluate(reviews, statsPayload, meta.platform, meta.priceInfo);
    } catch (err) {
      logger.warn('[AnalysisService] TrustEngine failed silently: ' + err.message);
    }

    // 9. Append engines to response ONLY if they returned a valid result
    return {
      ...existingResult,
      isLive: !!liveMeta,
      ...(liveMeta ? {
        productName: liveMeta.productName,
        productImage: liveMeta.productImage,
        platform: liveMeta.marketplace,
        priceInfo: { current: liveMeta.currentPrice, reference: liveMeta.originalPrice },
        productRating: liveMeta.productRating,
        totalRatings: liveMeta.totalRatings,
        sellerName: liveMeta.sellerName,
        specifications: liveMeta.specifications,
        deliveryInformation: liveMeta.deliveryInformation,
        productCategory: liveMeta.productCategory,
      } : {}),
      ...(authenticityEngine ? { authenticityEngine } : {}),
      ...(trustEngine ? { trustEngine } : {}),
    };
  }
}

module.exports = new AnalysisService();
