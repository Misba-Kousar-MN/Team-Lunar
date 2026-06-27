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
    const cleanUrl = (urlStr) => {
      try {
        const u = new URL(urlStr);
        return (u.origin + u.pathname).replace(/\/$/, '').toLowerCase();
      } catch {
        return urlStr.replace(/\/$/, '').toLowerCase();
      }
    };
    
    const target = cleanUrl(urlOrReviews);
    
    // Match against sample products (clean comparison)
    matchedProduct = sampleProducts.find(p => cleanUrl(p.url) === target) ||
                     sampleProducts.find(p => target.includes(p.id));

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

  const isUrl = typeof urlOrReviews === 'string' && urlOrReviews.trim().startsWith('http');
  const postData = isUrl ? { productUrl: urlOrReviews } : { reviews: reviewsToAnalyze };

  try {
    // 2. Attempt API Call
    const response = await api.post('/analyze', postData);
    const data = response.data;
    
    const total = data.statistics?.totalReviews || reviewsToAnalyze.length || 0;
    const fakeCount = data.statistics?.fakeReviews || 0;
    const realCount = data.statistics?.realReviews || 0;
    const genuinePercent = total > 0 ? Math.round((realCount / total) * 100) : 0;
    const fakePercent = total > 0 ? Math.round((fakeCount / total) * 100) : 0;
    
    const analysisList = data.analysis || data.reviews || [];

    // If backend reports that it is live data from Apify
    if (data.isLive) {
      return {
        productName: data.productName || getProductNameFromUrl(urlOrReviews),
        platform: data.platform || getPlatformFromUrl(urlOrReviews),
        url: data.url || urlOrReviews,
        productImage: data.productImage || '',
        currentPrice: data.priceInfo?.current || 0,
        originalPrice: data.priceInfo?.reference || 0,
        rating: data.productRating || 4.5,
        totalRatings: data.totalRatings || 100,
        sellerName: data.sellerName || 'Marketplace Seller',
        specifications: data.specifications || {},
        deliveryInformation: data.deliveryInformation || 'Standard Shipping',
        productCategory: data.productCategory || 'Electronics',
        isLive: true,
        trust_score: data.trustScore !== undefined ? data.trustScore * 10 : 80,
        genuine: genuinePercent,
        fake: fakePercent,
        reviews: analysisList.map((rev, index) => {
          let displayLabel = rev.label || 'Genuine';
          if (rev.prediction === 'Real') displayLabel = 'Genuine';
          if (rev.prediction === 'Fake') displayLabel = 'Fake';
          
          let rawConf = rev.confidence !== undefined ? rev.confidence : 1.0;
          if (rawConf > 1.0) {
            rawConf = rawConf / 100;
          }
   
          return {
            id: `rev-${index}`,
            text: rev.review || rev.text || '',
            label: displayLabel,
            confidence: rawConf,
            reason: rev.reason || "Classified by neural linguistic checker.",
            keywords: rev.keywords || []
          };
        }),
        ...(data.authenticityEngine ? { authenticityEngine: data.authenticityEngine } : {}),
        ...(data.trustEngine ? { trustEngine: data.trustEngine } : {}),
        isMock: false
      };
    }

    // Otherwise, fall back to matching sample product if data.isLive is false (backend mock fallback)
    if (matchedProduct) {
      return {
        productName: matchedProduct.name,
        platform: matchedProduct.platform,
        url: matchedProduct.url,
        productImage: matchedProduct.productImage || '',
        currentPrice: matchedProduct.currentPrice || 0,
        originalPrice: matchedProduct.originalPrice || 0,
        isLive: false,
        trust_score: data.trustScore !== undefined ? data.trustScore * 10 : (matchedProduct.trust_score || 0),
        genuine: genuinePercent,
        fake: fakePercent,
        reviews: analysisList.map((rev, index) => {
          const originalReview = matchedProduct.reviews[index] || fallbackAnalysis.reviews[index];
          let displayLabel = rev.label || 'Genuine';
          if (rev.prediction === 'Real') displayLabel = 'Genuine';
          if (rev.prediction === 'Fake') displayLabel = 'Fake';
          
          let rawConf = rev.confidence !== undefined ? rev.confidence : 1.0;
          if (rawConf > 1.0) {
            rawConf = rawConf / 100;
          }
   
          return {
            id: `rev-${index}`,
            text: rev.review || rev.text || '',
            label: displayLabel,
            confidence: rawConf,
            reason: rev.reason || originalReview?.reason || "Classified by neural linguistic checker.",
            keywords: originalReview?.keywords || []
          };
        }),
        ...(data.authenticityEngine ? { authenticityEngine: data.authenticityEngine } : {}),
        ...(data.trustEngine ? { trustEngine: data.trustEngine } : {}),
        isMock: false
      };
    } else {
      return {
        productName: getProductNameFromUrl(urlOrReviews),
        platform: getPlatformFromUrl(urlOrReviews),
        url: typeof urlOrReviews === 'string' && urlOrReviews.startsWith('http') ? urlOrReviews : '',
        isLive: false,
        trust_score: data.trustScore !== undefined ? data.trustScore * 10 : (fallbackAnalysis.trust_score || 0),
        genuine: genuinePercent,
        fake: fakePercent,
        reviews: analysisList.map((rev, index) => {
          const originalReview = fallbackAnalysis.reviews[index];
          let displayLabel = rev.label || 'Genuine';
          if (rev.prediction === 'Real') displayLabel = 'Genuine';
          if (rev.prediction === 'Fake') displayLabel = 'Fake';
          
          let rawConf = rev.confidence !== undefined ? rev.confidence : 1.0;
          if (rawConf > 1.0) {
            rawConf = rawConf / 100;
          }
   
          return {
            id: `rev-${index}`,
            text: rev.review || rev.text || '',
            label: displayLabel,
            confidence: rawConf,
            reason: rev.reason || originalReview?.reason || "Classified by neural linguistic checker.",
            keywords: originalReview?.keywords || []
          };
        }),
        ...(data.authenticityEngine ? { authenticityEngine: data.authenticityEngine } : {}),
        ...(data.trustEngine ? { trustEngine: data.trustEngine } : {}),
        isMock: false
      };
    }

  } catch (error) {
    console.warn("Backend API (/analyze) not reachable. Using local fallback simulator.", error);
    
    // Simulate API processing delay (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (matchedProduct) {
      return {
        productName: matchedProduct.name,
        platform: matchedProduct.platform,
        url: matchedProduct.url,
        productImage: matchedProduct.productImage || '',
        currentPrice: matchedProduct.currentPrice || 0,
        originalPrice: matchedProduct.originalPrice || 0,
        trust_score: matchedProduct.trust_score,
        genuine: matchedProduct.genuine,
        fake: matchedProduct.fake,
        reviews: matchedProduct.reviews,
        ...(matchedProduct.authenticityEngine ? { authenticityEngine: matchedProduct.authenticityEngine } : {}),
        ...(matchedProduct.trustEngine ? { trustEngine: matchedProduct.trustEngine } : {}),
        isLive: false,
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
        ...(fallbackAnalysis.authenticityEngine ? { authenticityEngine: fallbackAnalysis.authenticityEngine } : {}),
        ...(fallbackAnalysis.trustEngine ? { trustEngine: fallbackAnalysis.trustEngine } : {}),
        isLive: false,
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
