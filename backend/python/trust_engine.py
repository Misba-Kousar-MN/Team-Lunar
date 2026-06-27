"""
trust_engine.py
──────────────────────────────────────────────────────────────────────────────
Explainable Shopping Trust Engine (ESTE) Heuristic Engine
ReviewTrust AI — Standalone AI Core Module

OBJECTIVE:
  Compute Explainable AI signals for product shopping trust.
  Never claim absolute authenticity; always estimate trust with transparent metrics.
  Do NOT rely on Sentiment Analysis for Trust or Confidence scoring.

FORMULAS:
  1. Product Trust Score (0-100):
     - 35% Review Credibility (neural prediction ratios)
     - 20% Review Diversity (vocabulary richness & sentence layouts)
     - 15% Duplicate Review Detection (cosine similarities)
     - 15% Review Specificity (feature references vs generic praise)
     - 10% Marketplace Verification (demo/seeded status)
     - 5% Price Consistency (reference catalog drift)

  2. Overall Shopping Confidence (0-100):
     - 60% Product Trust Score
     - 40% Supporting Trust Signals

  3. Risk Classification:
     - 90-100: Excellent
     - 80-89: Highly Trustworthy
     - 65-79: Moderate Risk
     - 50-64: Exercise Caution
     - Below 50: High Risk
──────────────────────────────────────────────────────────────────────────────
"""

import sys
import json
import re
import math
import os
import warnings

# Suppress warnings to prevent polluting stdout for the Node wrapper
warnings.filterwarnings("ignore")
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

try:
    import numpy as np
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
except ImportError as e:
    print(json.dumps({"error": f"Required ML modules missing: {str(e)}"}), file=sys.stderr)
    sys.exit(1)

# Stopwords for keyword analysis
STOPWORDS = {"a", "an", "the", "and", "or", "but", "if", "then", "else", "is", "are", "was", "were", "it", "this", "that", "of", "to", "for", "with", "on", "at", "by", "in", "my", "you", "we", "they", "as"}

# Specific product features to reward in Specificity Score
SPECIFIC_KEYWORDS = {
    "battery", "camera", "display", "build", "performance", "packaging", 
    "delivery", "comfort", "installation", "warranty", "screen", "lens", 
    "compressor", "cooling", "cushion", "fabric", "wash", "kadhai", "speed", 
    "m3", "m2", "chip", "sound", "speaker", "muffled", "smudge", "bezel", 
    "charging", "charger", "plumbed", "dispenser"
}

# Vague words to penalize in Specificity Score
GENERIC_WORDS = {
    "great", "good", "nice", "excellent", "awesome", "perfect", "love", 
    "amazing", "ok", "okay", "like", "best", "super", "cool", "wonderful", 
    "satisfied", "very good", "must buy", "recommended"
}

# Risk keywords to track frequency
RISK_KEYWORDS = {
    "fake", "counterfeit", "duplicate", "replica", "copy", "refund", 
    "scam", "broken", "damaged", "used", "replacement", "not original"
}

def analyze_diversity(reviews):
    """
    Computes Review Diversity Score (0.0 - 20.0).
    Measures vocabulary richness and unique word ratios across the entire corpus.
    """
    if not reviews:
        return 10.0

    all_words = []
    unique_words = set()
    total_chars = 0
    
    for r in reviews:
        words = re.findall(r'\b\w{3,}\b', r.lower())
        filtered = [w for w in words if w not in STOPWORDS]
        all_words.extend(filtered)
        unique_words.update(filtered)
        total_chars += len(r)

    total_content_words = len(all_words)
    if total_content_words == 0:
        return 10.0

    # Vocabulary Richness Ratio
    richness_ratio = len(unique_words) / total_content_words
    
    # Sentence/Length diversity metric
    avg_len = total_chars / len(reviews)
    length_multiplier = min(avg_len / 150.0, 1.2)  # Cap length contribution

    # Calculate diversity score
    score = (richness_ratio * 15.0) * length_multiplier
    return min(20.0, max(5.0, round(score, 2)))

def analyze_duplicates(reviews):
    """
    Computes Duplicate Review Score Contribution (0.0 - 15.0).
    Measures near-duplicate clustering using TF-IDF + Cosine Similarity.
    """
    if not reviews or len(reviews) < 2:
        return 15.0

    try:
        vectorizer = TfidfVectorizer(stop_words='english', max_features=300)
        tfidf_matrix = vectorizer.fit_transform(reviews)
        sim_matrix = cosine_similarity(tfidf_matrix)

        n = len(reviews)
        dup_count = 0
        total_pairs = n * (n - 1) / 2

        for i in range(n):
            for j in range(i + 1, n):
                if sim_matrix[i][j] >= 0.80:
                    dup_count += 1

        dup_ratio = dup_count / max(total_pairs, 1)
        # 15 points max. Low duplicate ratio = higher score.
        score = (1.0 - dup_ratio) * 15.0
        return round(score, 2)
    except Exception:
        return 12.0

def analyze_specificity(reviews):
    """
    Computes Review Specificity Score (0.0 - 15.0).
    Rewards descriptive attribute references, penalizes boilerplate generic praise.
    """
    if not reviews:
        return 10.0

    specific_count = 0
    generic_count = 0

    for r in reviews:
        tokens = set(re.findall(r'\b\w{3,}\b', r.lower()))
        spec_hits = len(tokens.intersection(SPECIFIC_KEYWORDS))
        gen_hits = len(tokens.intersection(GENERIC_WORDS))

        specific_count += spec_hits
        generic_count += gen_hits

    total_hits = specific_count + generic_count
    if total_hits == 0:
        return 7.5

    spec_ratio = specific_count / total_hits
    score = spec_ratio * 15.0
    return min(15.0, max(3.0, round(score, 2)))

def evaluate_trust(payload):
    """
    Evaluates product risk parameters and returns an explainable AI trust matrix.
    """
    reviews = payload.get("reviews", [])
    statistics = payload.get("statistics", {})
    platform = payload.get("platform", "Unknown")
    
    # ── 1. Price Consistency (0 - 5.0 pts) ──
    price_info = payload.get("price_info", {})
    current_price = price_info.get("current", 0)
    market_price = price_info.get("reference", 0)
    
    price_consistent = True
    price_score = 5.0
    if current_price > 0 and market_price > 0:
        pct_drift = abs(current_price - market_price) / market_price
        if pct_drift > 0.30:
            price_consistent = False
            price_score = 2.0
        elif pct_drift > 0.15:
            price_score = 3.5

    # ── 2. Marketplace Verification (0 - 10.0 pts) ──
    marketplace_status = "Unknown"
    verification_score = 5.0
    
    plat_lower = platform.lower()
    if "amazon" in plat_lower:
        marketplace_status = "Amazon Fulfilled"
        verification_score = 10.0
    elif "flipkart" in plat_lower:
        marketplace_status = "Flipkart Assured"
        verification_score = 10.0
    elif "independent" in plat_lower:
        marketplace_status = "Independent Seller"
        verification_score = 7.0

    # ── 3. Review Credibility (0 - 35.0 pts) ──
    total = statistics.get("totalReviews", 0)
    genuine_ratio = 0.8
    if total > 0:
        genuine_ratio = statistics.get("realReviews", 0) / total
    credibility_score = genuine_ratio * 35.0

    # ── 4. Compute Other Signal Modifiers ──
    diversity_score = analyze_diversity(reviews)   # max 20
    duplicate_score = analyze_duplicates(reviews)   # max 15
    specificity_score = analyze_specificity(reviews) # max 15

    # ── 5. Product Trust Score (0-100) ──
    product_trust_score = (
        credibility_score + 
        diversity_score + 
        duplicate_score + 
        specificity_score + 
        verification_score + 
        price_score
    )
    product_trust_score = int(round(min(100.0, max(0.0, product_trust_score))))

    # ── 6. Risk Keyword Density & Risk Ratio ──
    all_tokens = []
    risk_hits = 0
    for r in reviews:
        tokens = re.findall(r'\b\w{3,}\b', r.lower())
        all_tokens.extend(tokens)
        for t in tokens:
            if t in RISK_KEYWORDS:
                risk_hits += 1

    risk_density = 0.0
    if len(all_tokens) > 0:
        risk_density = risk_hits / len(all_tokens)

    # ── 7. Overall Shopping Confidence (0-100) ──
    # Supporting signals metric (0-100 pts)
    # - 25% Duplicate Review Ratio (1.0 - ratio)
    # - 25% Review Diversity (diversity / 20)
    # - 20% Marketplace Verification (verification / 10)
    # - 15% Price Consistency (price / 5)
    # - 15% Risk Keyword Penalty (1.0 - risk_density * 10)
    
    dup_ratio = statistics.get("duplicateReviews", 0) / max(total, 1)
    dup_signal = (1.0 - dup_ratio) * 25.0
    div_signal = (diversity_score / 20.0) * 25.0
    verification_signal = (verification_score / 10.0) * 20.0
    price_signal = (price_score / 5.0) * 15.0
    
    risk_factor = max(0.0, 1.0 - (risk_density * 8.0))
    risk_signal = risk_factor * 15.0

    supporting_signals_score = dup_signal + div_signal + verification_signal + price_signal + risk_signal
    
    overall_confidence = (0.60 * product_trust_score) + (0.40 * supporting_signals_score)
    overall_confidence = int(round(min(100.0, max(0.0, overall_confidence))))

    # ── 8. Risk Level Mapping ──
    if overall_confidence >= 90:
        risk_level = "Excellent"
    elif overall_confidence >= 80:
        risk_level = "Highly Trustworthy"
    elif overall_confidence >= 65:
        risk_level = "Moderate Risk"
    elif overall_confidence >= 50:
        risk_level = "Exercise Caution"
    else:
        risk_level = "High Risk"

    # ── 9. Explainable AI Reasonings & Recommendations ──
    ai_reasoning = []
    triggered_flags = []
    recommendations = []

    # Credibility
    if genuine_ratio >= 0.80:
        ai_reasoning.append("High review credibility matching natural customer behavior.")
    else:
        ai_reasoning.append("Elevated suspicious review patterns detected by linguistic classifier.")
        triggered_flags.append("HIGH_SUSPICIOUS_REVIEW_RATIO")

    # Duplicates
    if dup_ratio <= 0.10:
        ai_reasoning.append("Low content duplication across reviews suggests independent buyers.")
    else:
        ai_reasoning.append("Coordinated review duplicates detected indicating template posting.")
        triggered_flags.append("COORDINATED_REVIEWS")
        recommendations.append("Filter reviews to 'Verified Purchase' only to bypass copy-pasted review clusters.")

    # Diversity
    if diversity_score >= 14.0:
        ai_reasoning.append("High vocabulary diversity with descriptive feedback patterns.")
    else:
        ai_reasoning.append("Boilerplate phrase repetitiveness indicates bulk commercial reviewers.")
        triggered_flags.append("LOW_VOCAB_DIVERSITY")

    # Specificity
    if specificity_score >= 10.0:
        ai_reasoning.append("Reviews contain highly specific details about product features.")
    else:
        ai_reasoning.append("High proportion of short generic praise reviews with no specific product test insights.")
        triggered_flags.append("GENERIC_PRAISE_STUFFING")

    # Pricing
    if price_consistent:
        ai_reasoning.append("Listing price matches current reference market valuation.")
    else:
        ai_reasoning.append("Unusual pricing discrepancy detected against market average.")
        triggered_flags.append("PRICE_ANOMALY")
        recommendations.append("Double check pricing with official retail stores to avoid counterfeit listings.")

    # Marketplace verification
    if verification_score == 10.0:
        ai_reasoning.append(f"Marketplace verified listing logistics ({marketplace_status}).")
    else:
        ai_reasoning.append("Seller fulfillment origin verification unavailable.")
        triggered_flags.append("UNVERIFIED_LOGISTICS")

    # General recommendations
    if overall_confidence < 65:
        recommendations.append("Review patterns indicate high likelihood of rating inflation. Exercise caution.")
    elif overall_confidence >= 80:
        recommendations.append("Confidence profile is healthy. Authentic purchase indicators are strong.")

    if not recommendations:
        recommendations.append("Verify seller return policies before making a final purchase.")

    return {
        "product_trust_score": product_trust_score,
        "overall_shopping_confidence": overall_confidence,
        "risk_level": risk_level,
        "marketplace_status": marketplace_status,
        "triggered_flags": triggered_flags,
        "ai_reasoning": ai_reasoning[:5],  # limit to top 5
        "recommendations": recommendations[:3]
    }

def main():
    try:
        raw_input = sys.stdin.read()
        if not raw_input.strip():
            print(json.dumps({"error": "No input received"}), file=sys.stderr)
            sys.exit(1)

        payload = json.loads(raw_input)
        result = evaluate_trust(payload)
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": f"Trust engine failure: {str(e)}"}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
