import axios from 'axios';
import { sampleProducts, fallbackAnalysis } from './mockData';

// Backend server URL (configurable, default to localhost:5000 or relative root)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeProduct = async (urlOrReviews) => {
  let reviewsToAnalyze = [];
  let matchedProduct = null;

  // 1. Determine if input is a URL or direct reviews
  if (typeof urlOrReviews === 'string') {
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
      reviewsToAnalyze = matchedProduct.reviews.map(r => r.text);
    } else {
      reviewsToAnalyze = fallbackAnalysis.reviews.map(r => r.text);
    }
  } else if (Array.isArray(urlOrReviews)) {
    reviewsToAnalyze = urlOrReviews;
  }

  if (reviewsToAnalyze.length === 0) {
    reviewsToAnalyze = [
      "Excellent quality and value. Best purchase of the year!",
      "Worst experience ever. Do not buy this scam product."
    ];
  }

  try {
    // 2. Attempt API Call
    const response = await api.post('/analyze', { reviews: reviewsToAnalyze });
    const data = response.data;
    
    // Transform API response to match our display requirements
    return {
      productName: matchedProduct ? matchedProduct.name : getProductNameFromUrl(urlOrReviews),
      platform: matchedProduct ? matchedProduct.platform : getPlatformFromUrl(urlOrReviews),
      url: typeof urlOrReviews === 'string' && urlOrReviews.startsWith('http') ? urlOrReviews : '',
      trust_score: data.trust_score,
      genuine: data.genuine,
      fake: data.fake,
      reviews: data.reviews.map((rev, index) => {
        const originalReview = matchedProduct?.reviews[index] || fallbackAnalysis.reviews[index];
        return {
          id: `rev-${index}`,
          text: rev.text,
          label: rev.label, // 'Fake' or 'Genuine'
          confidence: rev.confidence,
          reason: rev.reason || originalReview?.reason || "Classified by neural linguistic checker.",
          keywords: originalReview?.keywords || []
        };
      }),
      isMock: false
    };

  } catch (error) {
    console.warn("Backend API (/analyze) not reachable. Using local fallback simulator.", error);
    
    // Simulate API processing delay (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (matchedProduct) {
      return {
        productName: matchedProduct.name,
        platform: matchedProduct.platform,
        url: matchedProduct.url,
        trust_score: matchedProduct.trust_score,
        genuine: matchedProduct.genuine,
        fake: matchedProduct.fake,
        reviews: matchedProduct.reviews,
        isMock: true
      };
    } else {
      return {
        productName: getProductNameFromUrl(urlOrReviews),
        platform: getPlatformFromUrl(urlOrReviews),
        url: typeof urlOrReviews === 'string' && urlOrReviews.startsWith('http') ? urlOrReviews : '',
        trust_score: fallbackAnalysis.trust_score,
        genuine: fallbackAnalysis.genuine,
        fake: fallbackAnalysis.fake,
        reviews: fallbackAnalysis.reviews,
        isMock: true
      };
    }
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
