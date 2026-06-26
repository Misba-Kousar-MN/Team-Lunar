const AnalysisHistory = require('../models/analysis.model');
const AppError = require('../utils/AppError');

/**
 * Fetches all analysis history logs from the database, sorted newest first
 */
const getHistories = async (req, res, next) => {
  try {
    const histories = await AnalysisHistory.find()
      .sort({ createdAt: -1 })
      .select('-__v'); // Exclude mongoose internal version key

    res.status(200).json({
      status: 'success',
      results: histories.length,
      data: histories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetches a single analysis log by its ID
 */
const getHistoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const history = await AnalysisHistory.findById(id).select('-__v');

    if (!history) {
      return next(new AppError(`No analysis log found with ID: ${id}`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a single analysis log by its ID
 */
const deleteHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const history = await AnalysisHistory.findByIdAndDelete(id);

    if (!history) {
      return next(new AppError(`No analysis log found with ID: ${id}`, 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHistories,
  getHistoryById,
  deleteHistory,
};
