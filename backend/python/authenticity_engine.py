"""
authenticity_engine.py
──────────────────────────────────────────────────────────────────────────────
Product Authenticity & Seller Credibility Risk Engine
ReviewTrust AI — Modular Intelligence Layer

DESIGN PRINCIPLE:
  This module is a completely standalone service. It does NOT import from,
  modify, or depend on analyze.py in any way. It receives the same review
  texts the existing pipeline already processed, runs its own independent
  heuristic scoring, and returns a structured result object.

ENTRY POINT:
  Called as a subprocess by authenticity.service.js
  Reads JSON from stdin: { "reviews": [...], "statistics": {...} }
  Writes JSON to stdout: { ...result }

NO BREAKING CHANGES: This module never modifies the analyze.py pipeline.
──────────────────────────────────────────────────────────────────────────────
"""

import sys
import json
import re
import math
import os
import warnings

# Suppress all warnings to keep stdout clean for Node.js JSON parsing
warnings.filterwarnings("ignore")
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

try:
    import numpy as np
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
except ImportError as e:
    print(json.dumps({"error": f"Missing dependency: {str(e)}"}), file=sys.stderr)
    sys.exit(1)


# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTS & HEURISTIC THRESHOLDS
# ─────────────────────────────────────────────────────────────────────────────

# Spam language patterns (regex, case-insensitive)
SPAM_PHRASES = re.compile(
    r'\b(buy now|best ever|must buy|highly recommend|five star|5 star|'
    r'fast delivery|quick delivery|good packing|good packaging|'
    r'value for money|worth every penny|dont regret|do not regret|'
    r'you will not regret|best purchase|amazing product|superb product|'
    r'excellent product|top quality|original product)\b',
    re.IGNORECASE
)

# ALL-CAPS word pattern (flags shouting/hype language)
ALL_CAPS_WORD = re.compile(r'\b[A-Z]{4,}\b')

# Exclamation density threshold (more than 2 per 50 words = spam indicator)
MAX_EXCLAMATION_RATIO = 0.04  # 4 exclamations per 100 chars = suspicious

# Semantic duplicate threshold (cosine similarity >= this = near-duplicate)
DUPLICATE_SIM_THRESHOLD = 0.82

# Diversity score thresholds
LOW_DIVERSITY_VOCAB_RATIO = 0.3  # unique_words / total_words < 0.3 = low diversity


# ─────────────────────────────────────────────────────────────────────────────
# SIGNAL CALCULATORS
# ─────────────────────────────────────────────────────────────────────────────

def _compute_fake_ratio_score(statistics: dict) -> float:
    """
    Signal 1: Fake Review Ratio Score (0.0 – 35.0 points)
    Higher genuine ratio → higher score contribution.
    Uses statistics dict passed from the existing analysis pipeline.
    """
    total = statistics.get("totalReviews", 0)
    if total == 0:
        return 35.0  # No reviews → no penalty
    genuine = statistics.get("realReviews", 0)
    ratio = genuine / total
    return round(ratio * 35.0, 2)


def _compute_duplicate_score(statistics: dict) -> float:
    """
    Signal 2: Duplicate Review Ratio Score (0.0 – 20.0 points)
    More duplicates → lower score contribution.
    """
    total = statistics.get("totalReviews", 0)
    if total == 0:
        return 20.0
    duplicates = statistics.get("duplicateReviews", 0)
    # Invert: low duplicates = high score
    clean_ratio = 1.0 - (duplicates / total)
    return round(clean_ratio * 20.0, 2)


def _compute_generic_score(statistics: dict) -> float:
    """
    Signal 3: Generic Review Ratio Score (0.0 – 15.0 points)
    More generic boilerplate → lower score.
    """
    total = statistics.get("totalReviews", 0)
    if total == 0:
        return 15.0
    generic = statistics.get("genericReviews", 0)
    clean_ratio = 1.0 - (generic / total)
    return round(clean_ratio * 15.0, 2)


def _compute_diversity_score(reviews: list) -> float:
    """
    Signal 4: Review Vocabulary Diversity Score (0.0 – 10.0 points)
    Uses TF-IDF unique vocabulary breadth across all reviews.
    A highly diverse vocabulary suggests authentic human reviewers.
    """
    if not reviews or len(reviews) < 2:
        return 5.0  # Neutral for single/no reviews

    try:
        # Combine all reviews into one corpus entry per review
        vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=500,
            min_df=1
        )
        vectorizer.fit(reviews)
        vocab_size = len(vectorizer.vocabulary_)

        # Total unique meaningful words across all reviews
        # More vocabulary spread = higher diversity
        # Normalize against a reasonable ceiling of 200 unique words
        diversity_ratio = min(vocab_size / 200.0, 1.0)
        return round(diversity_ratio * 10.0, 2)

    except Exception:
        return 5.0  # Safe neutral fallback


def _compute_sentiment_skew_score(reviews: list) -> float:
    """
    Signal 5: Sentiment Polarity Skew Score (0.0 – 10.0 points)
    Detects extreme positive sentiment saturation (manufactured consensus).
    Uses simple heuristic: count reviews with excessive positive language.
    """
    if not reviews:
        return 10.0

    HYPER_POSITIVE = re.compile(
        r'\b(amazing|awesome|perfect|excellent|superb|outstanding|'
        r'best ever|incredible|fantastic|wonderful|love it|mind blowing)\b',
        re.IGNORECASE
    )

    hyper_count = sum(1 for r in reviews if HYPER_POSITIVE.search(r))
    hyper_ratio = hyper_count / len(reviews)

    # If >60% of reviews are hyper-positive, reduce score significantly
    if hyper_ratio > 0.60:
        return round((1.0 - hyper_ratio) * 10.0, 2)
    elif hyper_ratio > 0.40:
        return round((1.0 - (hyper_ratio * 0.5)) * 10.0, 2)
    else:
        return 10.0  # Healthy distribution


def _compute_confidence_score(statistics: dict) -> float:
    """
    Signal 6: Average AI Model Confidence Score (0.0 – 10.0 points)
    Passed from the existing analysis pipeline's statistics.
    """
    avg_conf = statistics.get("avgConfidence", None)
    if avg_conf is None:
        return 7.0  # Default neutral if not provided
    # Normalize: confidence is 0–100 from pipeline
    return round((avg_conf / 100.0) * 10.0, 2)


def _compute_keyword_density_score(reviews: list) -> float:
    """
    Signal 7 (Authenticity): Keyword/Model-Name Density Anomaly (0.0 – 30.0 pts)
    Detects spam keyword stuffing where product model names appear
    repeatedly in a single review — a hallmark of SEO-bait fake reviews.
    """
    if not reviews:
        return 30.0

    stuffed_count = 0
    for review in reviews:
        words = review.lower().split()
        if len(words) == 0:
            continue
        # Count words repeated >= 3 times in a single review
        word_freq = {}
        for w in words:
            word_freq[w] = word_freq.get(w, 0) + 1
        max_freq = max(word_freq.values())
        if max_freq >= 3 and (max_freq / len(words)) > 0.15:
            stuffed_count += 1

    stuffed_ratio = stuffed_count / len(reviews)
    clean_ratio = 1.0 - stuffed_ratio
    return round(clean_ratio * 30.0, 2)


def _compute_semantic_cluster_score(reviews: list) -> float:
    """
    Signal 8 (Authenticity): Semantic Clustering Score (0.0 – 30.0 pts)
    Reviews that cluster tightly in TF-IDF space suggest templated bulk reviews.
    A healthy review set has reviews spread across diverse semantic topics.
    """
    if not reviews or len(reviews) < 3:
        return 25.0  # Insufficient data, give benefit of the doubt

    try:
        vectorizer = TfidfVectorizer(stop_words='english', max_features=300)
        tfidf_matrix = vectorizer.fit_transform(reviews)
        sim_matrix = cosine_similarity(tfidf_matrix)

        # Count pairs with high similarity (excluding self)
        n = len(reviews)
        high_sim_pairs = 0
        total_pairs = n * (n - 1) / 2

        for i in range(n):
            for j in range(i + 1, n):
                if sim_matrix[i][j] > DUPLICATE_SIM_THRESHOLD:
                    high_sim_pairs += 1

        cluster_ratio = high_sim_pairs / max(total_pairs, 1)
        # Low cluster_ratio = diverse = high score
        diversity_contribution = 1.0 - cluster_ratio
        return round(diversity_contribution * 30.0, 2)

    except Exception:
        return 20.0  # Safe neutral fallback


def _compute_spam_pattern_score(reviews: list) -> float:
    """
    Signal 9 (Authenticity): Spam Language Pattern Score (0.0 – 25.0 pts)
    Detects commercial spam patterns: ALL CAPS words, exclamation spam,
    and known fake review phrase templates.
    """
    if not reviews:
        return 25.0

    spam_count = 0
    for review in reviews:
        flags = 0
        # Spam phrase detection
        if SPAM_PHRASES.search(review):
            flags += 1
        # ALL-CAPS hype word detection (>= 2 ALL-CAPS words = suspicious)
        caps_words = ALL_CAPS_WORD.findall(review)
        if len(caps_words) >= 2:
            flags += 1
        # Exclamation spam (more than 2 exclamations in a review)
        exclamations = review.count('!')
        if exclamations >= 3:
            flags += 1

        if flags >= 2:  # At least 2 spam signals in one review = flagged
            spam_count += 1

    spam_ratio = spam_count / len(reviews)
    clean_ratio = 1.0 - spam_ratio
    return round(clean_ratio * 25.0, 2)


def _compute_text_uniqueness_score(reviews: list) -> float:
    """
    Signal 10 (Authenticity): Text Uniqueness Score (0.0 – 15.0 pts)
    Measures average lexical diversity (type-token ratio) across all reviews.
    """
    if not reviews:
        return 15.0

    ttr_scores = []
    for review in reviews:
        tokens = re.findall(r'\b\w{3,}\b', review.lower())
        if not tokens:
            continue
        unique = len(set(tokens))
        ttr = unique / len(tokens)
        ttr_scores.append(ttr)

    if not ttr_scores:
        return 7.5

    avg_ttr = sum(ttr_scores) / len(ttr_scores)
    return round(avg_ttr * 15.0, 2)


# ─────────────────────────────────────────────────────────────────────────────
# FLAG GENERATION
# ─────────────────────────────────────────────────────────────────────────────

def _generate_flags(statistics: dict, reviews: list, signal_scores: dict) -> list:
    """
    Generates a list of human-readable triggered flag identifiers
    based on heuristic threshold checks across all signals.
    """
    flags = []
    total = statistics.get("totalReviews", 1) or 1

    # Flag 1: High fake ratio
    fake_ratio = statistics.get("fakeReviews", 0) / total
    if fake_ratio > 0.40:
        flags.append("HIGH_FAKE_RATIO")

    # Flag 2: Duplicate cluster
    dup_ratio = statistics.get("duplicateReviews", 0) / total
    if dup_ratio > 0.20:
        flags.append("DUPLICATE_CLUSTER")

    # Flag 3: Generic template reviews
    gen_ratio = statistics.get("genericReviews", 0) / total
    if gen_ratio > 0.30:
        flags.append("GENERIC_TEMPLATE_REVIEWS")

    # Flag 4: Extreme sentiment skew (computed from signal score)
    if signal_scores.get("sentiment_skew", 10) < 5.0:
        flags.append("EXTREME_SENTIMENT_SKEW")

    # Flag 5: Spam keyword stuffing (computed from signal score)
    if signal_scores.get("keyword_density", 30) < 15.0:
        flags.append("SPAM_KEYWORD_STUFFING")

    # Flag 6: Low review diversity (TF-IDF vocabulary score)
    if signal_scores.get("diversity", 10) < 4.0:
        flags.append("LOW_REVIEW_DIVERSITY")

    # Flag 7: Coordinated review pattern (combination of multiple flags)
    if len(flags) >= 3:
        flags.append("COORDINATED_REVIEW_PATTERN")

    # Positive Flag 8: Verified content signals (high genuine + high diversity)
    if fake_ratio < 0.20 and signal_scores.get("diversity", 0) >= 7.0:
        flags.append("VERIFIED_CONTENT_SIGNALS")

    return flags


# ─────────────────────────────────────────────────────────────────────────────
# RECOMMENDATION ENGINE
# ─────────────────────────────────────────────────────────────────────────────

def _generate_recommendations(flags: list, seller_score: int, auth_score: int) -> list:
    """
    Generates 3–5 targeted, actionable AI recommendations based on
    triggered flags and composite scores. Always returns at least one item.
    """
    recs = []

    if "HIGH_FAKE_RATIO" in flags:
        recs.append("Over 40% of reviews show suspicious patterns. Cross-verify on independent review platforms like Trustpilot or consumer forums before purchasing.")

    if "DUPLICATE_CLUSTER" in flags:
        recs.append("Multiple semantically identical reviews detected, indicating coordinated review activity. Prioritize reviews from Verified Purchase buyers only.")

    if "GENERIC_TEMPLATE_REVIEWS" in flags:
        recs.append("A significant portion of reviews use boilerplate promotional language. Look for reviews that mention specific product features or usage scenarios.")

    if "SPAM_KEYWORD_STUFFING" in flags:
        recs.append("Spam-grade keyword stuffing patterns identified. These reviews are likely computer-generated or from incentivized review networks.")

    if "EXTREME_SENTIMENT_SKEW" in flags:
        recs.append("Unusually high concentration of extreme positive sentiment — this may indicate artificially inflated ratings. Search for critical or neutral reviews to get an accurate picture.")

    if "LOW_REVIEW_DIVERSITY" in flags:
        recs.append("Review vocabulary is unusually narrow, suggesting the reviews may originate from a limited source. Seek reviews from multiple verified buyers.")

    if "COORDINATED_REVIEW_PATTERN" in flags:
        recs.append("Multiple risk signals triggered simultaneously. This product's review profile shows strong indicators of coordinated manipulation. Exercise significant caution.")

    if "VERIFIED_CONTENT_SIGNALS" in flags:
        recs.append("Strong genuine content signals detected. Authentic reviews with diverse vocabulary and specific product details suggest a trustworthy seller profile.")

    # Score-based catch-all recommendations
    if seller_score < 50:
        recs.append("Seller credibility score is below threshold. Consider purchasing from an alternative seller or verified platform store for this product.")

    if auth_score >= 75 and not recs:
        recs.append("Product authenticity signals are strong. Reviews appear to be from genuine buyers with diverse, product-specific feedback.")

    # Always ensure at least one recommendation
    if not recs:
        recs.append("Review profile shows mixed signals. Proceed with normal purchasing caution and check for a valid return policy.")

    # Cap at 5 recommendations for UI cleanliness
    return recs[:5]


# ─────────────────────────────────────────────────────────────────────────────
# RISK CATEGORY MAPPER
# ─────────────────────────────────────────────────────────────────────────────

def _get_risk_category(avg_score: float) -> str:
    """Maps composite average score to a human-readable risk category."""
    if avg_score >= 75:
        return "Low Risk"
    elif avg_score >= 50:
        return "Medium Risk"
    elif avg_score >= 25:
        return "High Risk"
    else:
        return "Critical Risk"


# ─────────────────────────────────────────────────────────────────────────────
# PUBLIC API — evaluate_product_risk
# ─────────────────────────────────────────────────────────────────────────────

def evaluate_product_risk(reviews: list, statistics: dict) -> dict:
    """
    Main entry point for the Authenticity & Credibility Risk Engine.

    Parameters
    ----------
    reviews    : list[str]  — Raw review text strings (same as analyze.py input)
    statistics : dict       — Statistics dict from the existing analysis pipeline:
                              { totalReviews, fakeReviews, realReviews,
                                duplicateReviews, genericReviews }

    Returns
    -------
    dict with keys:
        seller_credibility_score   : int   (0–100)
        product_authenticity_score : int   (0–100)
        risk_category              : str
        risk_level                 : str   (alias — same as risk_category)
        triggered_flags            : list[str]
        recommendations            : list[str]
        signal_breakdown           : dict  (individual signal scores for UI charts)
    """
    if not reviews:
        return {
            "seller_credibility_score": 50,
            "product_authenticity_score": 50,
            "risk_category": "Medium Risk",
            "risk_level": "Medium Risk",
            "triggered_flags": [],
            "recommendations": ["Insufficient review data for a full analysis."],
            "signal_breakdown": {}
        }

    # ── Compute all individual signal scores ─────────────────────────────────

    sig_fake_ratio   = _compute_fake_ratio_score(statistics)       # 0–35
    sig_duplicate    = _compute_duplicate_score(statistics)        # 0–20
    sig_generic      = _compute_generic_score(statistics)          # 0–15
    sig_diversity    = _compute_diversity_score(reviews)           # 0–10
    sig_sentiment    = _compute_sentiment_skew_score(reviews)      # 0–10
    sig_confidence   = _compute_confidence_score(statistics)       # 0–10

    sig_kw_density   = _compute_keyword_density_score(reviews)     # 0–30
    sig_clustering   = _compute_semantic_cluster_score(reviews)    # 0–30
    sig_spam         = _compute_spam_pattern_score(reviews)        # 0–25
    sig_uniqueness   = _compute_text_uniqueness_score(reviews)     # 0–15

    # ── Seller Credibility Score (sum of credibility signals, max 100) ────────
    raw_seller = (
        sig_fake_ratio +
        sig_duplicate +
        sig_generic +
        sig_diversity +
        sig_sentiment +
        sig_confidence
    )
    seller_credibility_score = int(round(min(100, max(0, raw_seller))))

    # ── Product Authenticity Score (sum of authenticity signals, max 100) ─────
    raw_auth = (
        sig_kw_density +
        sig_clustering +
        sig_spam +
        sig_uniqueness
    )
    product_authenticity_score = int(round(min(100, max(0, raw_auth))))

    # ── Signal breakdown dict for transparency (all raw signal values) ────────
    signal_breakdown = {
        "fake_ratio_contribution": sig_fake_ratio,
        "duplicate_penalty":       round(20.0 - sig_duplicate, 2),
        "generic_penalty":         round(15.0 - sig_generic, 2),
        "vocabulary_diversity":    sig_diversity,
        "sentiment_balance":       sig_sentiment,
        "ai_confidence_weight":    sig_confidence,
        "keyword_stuffing_penalty": round(30.0 - sig_kw_density, 2),
        "semantic_cluster_penalty": round(30.0 - sig_clustering, 2),
        "spam_pattern_penalty":     round(25.0 - sig_spam, 2),
        "text_uniqueness":          sig_uniqueness,
    }

    # ── Flags & Recommendations ───────────────────────────────────────────────
    signal_scores_for_flags = {
        "sentiment_skew": sig_sentiment,
        "keyword_density": sig_kw_density,
        "diversity": sig_diversity,
    }

    triggered_flags = _generate_flags(statistics, reviews, signal_scores_for_flags)
    recommendations = _generate_recommendations(
        triggered_flags, seller_credibility_score, product_authenticity_score
    )

    # ── Risk Category from composite average ──────────────────────────────────
    composite_avg = (seller_credibility_score + product_authenticity_score) / 2.0
    risk_category = _get_risk_category(composite_avg)

    return {
        "seller_credibility_score":   seller_credibility_score,
        "product_authenticity_score": product_authenticity_score,
        "risk_category":              risk_category,
        "risk_level":                 risk_category,   # UI alias
        "triggered_flags":            triggered_flags,
        "recommendations":            recommendations,
        "signal_breakdown":           signal_breakdown,
    }


# ─────────────────────────────────────────────────────────────────────────────
# SUBPROCESS ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────

def main():
    """
    Subprocess entry point. Reads JSON from stdin, writes JSON to stdout.
    Input:  { "reviews": [...], "statistics": {...} }
    Output: { ...evaluate_product_risk result }
    """
    try:
        raw_input = sys.stdin.read()
        if not raw_input.strip():
            print(json.dumps({"error": "No input received"}), file=sys.stderr)
            sys.exit(1)

        payload = json.loads(raw_input)
        reviews    = payload.get("reviews", [])
        statistics = payload.get("statistics", {})

        result = evaluate_product_risk(reviews, statistics)
        print(json.dumps(result))

    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON input: {str(e)}"}), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": f"Engine execution error: {str(e)}"}), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
