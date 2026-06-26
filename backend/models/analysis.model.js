const mongoose = require('mongoose');

// Schema for individual review analysis output
const reviewAnalysisSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true,
    trim: true,
  },
  prediction: {
    type: String,
    enum: ['Fake', 'Real'],
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  reason: {
    type: [String],
    default: [],
  },
});

// Main schema for tracking analysis history
const analysisHistorySchema = new mongoose.Schema({
  originalReviews: {
    type: [String],
    required: true,
  },
  trustScore: {
    type: Number,
    required: true,
    min: 1.0,
    max: 10.0,
  },
  recommendation: {
    type: String,
    required: true,
    enum: ['Highly Trustworthy', 'Likely Trustworthy', 'Mixed Reviews', 'Suspicious', 'Highly Suspicious'],
  },
  statistics: {
    totalReviews: {
      type: Number,
      required: true,
      min: 0,
    },
    fakeReviews: {
      type: Number,
      required: true,
      min: 0,
    },
    realReviews: {
      type: Number,
      required: true,
      min: 0,
    },
    duplicateReviews: {
      type: Number,
      required: true,
      min: 0,
    },
    genericReviews: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  analysis: [reviewAnalysisSchema],
}, {
  timestamps: true, // Auto-generates createdAt (timestamp) and updatedAt
});

module.exports = mongoose.model('AnalysisHistory', analysisHistorySchema);
