const analysisService = require('../services/analysis.service');

const analyzeReviews = async (req, res, next) => {
  try {
    const { reviews } = req.body;

    // Delegate analysis and saving logic to the analysis service
    const analysisResult = await analysisService.analyzeReviews(reviews);

    // Return the response matching the exact output schema requested
    res.status(200).json(analysisResult);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeReviews,
};
