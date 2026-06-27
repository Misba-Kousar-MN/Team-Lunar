import axios from 'axios';
import { sampleProducts, fallbackAnalysis } from './mockData';

// Backend server URL (configurable, default to localhost:5000 or relative root)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeProduct = async (urlOrReviews) => {
  let reviewsToAnalyze = [];
  let matchedProduct = null;

  const isUrl = typeof urlOrReviews === 'string' && (urlOrReviews.startsWith('http://') || urlOrReviews.startsWith('https://'));

  // 1. Determine if input is a URL or direct reviews
  if (typeof urlOrReviews === 'string' && !isUrl) {
    const normalized = urlOrReviews.toLowerCase();
    
    // Match against sample products
    matchedProduct = sampleProducts.find(p => 
      normalized.includes(p.id) || 
      normalized.includes(p.platform.toLowerCase()) ||
      p.url.toLowerCase().includes(normalized) ||
      (normalized.includes('echo') && p.id === 'amazon-echo') ||
      (normalized.includes('tv') && p.id === 'flipkart-tv') ||
      ((normalized.includes('iphone') || normalized.includes('apple')) && p.id === 'iphone-15')
    );

    if (matchedProduct) {
      reviewsToAnalyze = matchedProduct.reviews.map(r => typeof r === 'string' ? r : r.text);
    } else {
      reviewsToAnalyze = fallbackAnalysis.reviews.map(r => typeof r === 'string' ? r : r.text);
    }
  } else if (Array.isArray(urlOrReviews)) {
    reviewsToAnalyze = urlOrReviews;
  }

  if (!isUrl && reviewsToAnalyze.length === 0) {
    reviewsToAnalyze = [
      "Excellent quality and value. Best purchase of the year!",
      "Worst experience ever. Do not buy this scam product."
    ];
  }

  try {
    // 2. Attempt API Call
    const payload = isUrl ? { productUrl: urlOrReviews } : { reviews: reviewsToAnalyze };
    const response = await api.post('/api/analyze', payload);
    const data = response.data;
    
    // Transform API response to match our display requirements
    return {
      productName: matchedProduct ? matchedProduct.name : getProductNameFromUrl(urlOrReviews),
      platform: matchedProduct ? matchedProduct.platform : getPlatformFromUrl(urlOrReviews),
      url: isUrl ? urlOrReviews : '',
      trustScore: data.trustScore,
      statistics: {
        realReviews: data.statistics.realReviews,
        fakeReviews: data.statistics.fakeReviews
      },
      analysis: data.analysis,
      recommendation: data.recommendation,
      isMock: false
    };

  } catch (error) {
    console.error("Backend API (/api/analyze) error:", error);
    throw error;
  }
};

function getPlatformFromUrl(url) {
  if (typeof url !== 'string') return 'E-Commerce';
  if (url.toLowerCase().includes('flipkart')) return 'Flipkart';
  if (url.toLowerCase().includes('amazon')) return 'Amazon';
  return 'E-Commerce';
}

function getProductNameFromUrl(url) {
  if (typeof url !== 'string' || !url.startsWith('http')) return "Generic Product Analysis";
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    // Try to find Amazon or Flipkart naming in the path
    for (const part of pathParts) {
      if (part.length > 5 && !part.includes('.') && isNaN(part) && part !== 'product' && part !== 'dp') {
        return part
          .replace(/-/g, ' ')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase())
          .substring(0, 50) + "...";
      }
    }
  } catch (e) {
    // invalid URL format
  }
  return "Custom E-Commerce Product";
}
