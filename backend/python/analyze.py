import sys
import json
import re
import os
import warnings

# Suppress warnings from polluting stdout
warnings.filterwarnings("ignore")
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["TRANSFORMERS_VERBOSITY"] = "error"

try:
    import numpy as np
    from sentence_transformers import SentenceTransformer
    from transformers import pipeline
except ImportError as e:
    # Return JSON error to Node.js
    print(json.dumps({"error": f"Required Python libraries not installed: {str(e)}"}), file=sys.stderr)
    sys.exit(1)

# Initialize models globally
try:
    # Lightweight, fast, high-quality sentence embeddings
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # Pre-trained fast sentiment analysis pipeline
    sentiment_analyzer = pipeline(
        'sentiment-analysis', 
        model='distilbert-base-uncased-finetuned-sst-2-english',
        device=-1 # Use CPU
    )
except Exception as e:
    print(json.dumps({"error": f"Failed to load AI models: {str(e)}"}), file=sys.stderr)
    sys.exit(1)

STOPWORDS = {"a", "an", "the", "and", "or", "but", "if", "then", "else", "is", "are", "was", "were", "it", "this", "that", "of", "to", "for", "with", "on", "at", "by", "in", "my", "you", "we", "they"}
GENERIC_WORDS = {"great", "good", "nice", "excellent", "awesome", "perfect", "love", "amazing", "ok", "okay", "like", "best", "super", "cool", "wonderful", "satisfied"}

def analyze_repetition(text):
    """Detects spammy keyword stuffing or high lexical repetition."""
    words = re.findall(r'\b\w{3,}\b', text.lower()) # words >= 3 chars
    if not words:
        return False, None
        
    filtered_words = [w for w in words if w not in STOPWORDS]
    if not filtered_words:
        return False, None

    word_counts = {}
    for w in filtered_words:
        word_counts[w] = word_counts.get(w, 0) + 1

    total_words = len(filtered_words)
    for word, count in word_counts.items():
        # If a single content word occupies > 35% of the content words and appears at least 3 times
        if count >= 3 and (count / total_words) >= 0.35:
            return True, word
            
    return False, None

def analyze_generic(text):
    """Detects brief, generic promotional phrases without specific product details."""
    cleaned = re.sub(r'[^\w\s]', '', text.lower()).strip()
    words = cleaned.split()
    
    if not words:
        return True
        
    # Check if all words are simple generic praise or stopwords
    meaningful_words = [w for w in words if w not in STOPWORDS]
    if not meaningful_words:
        return True
        
    is_all_generic = all(w in GENERIC_WORDS for w in meaningful_words)
    
    # Generic reviews are usually short
    if len(words) <= 5 and is_all_generic:
        return True
        
    return False

def main():
    try:
        # Read from stdin
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"error": "No input received"}), file=sys.stderr)
            sys.exit(1)

        payload = json.loads(input_data)
        reviews = payload.get("reviews", [])

        if not reviews:
            print(json.dumps([]))
            return

        # 1. Semantic Embeddings & Similarity Calculation
        embeddings = embedding_model.encode(reviews, show_progress_bar=False)
        norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
        # Handle zero-vector division safely
        norms[norms == 0] = 1e-9
        normalized_embeddings = embeddings / norms
        # Compute pairwise cosine similarities
        similarity_matrix = np.dot(normalized_embeddings, normalized_embeddings.T)

        # 2. Sentiment analysis in batch for speed
        sentiment_results = sentiment_analyzer(reviews)

        analysis_output = []

        for i, review in enumerate(reviews):
            reasons = []
            is_duplicate = False
            is_generic = False
            is_short = False
            has_repetition = False
            
            # Context and pre-processing
            trimmed_review = review.strip()
            word_count = len(trimmed_review.split())
            char_count = len(trimmed_review)

            # Feature 1: Semantic duplicate detection (exclude self similarity)
            duplicate_indices = []
            for j in range(len(reviews)):
                if i != j and similarity_matrix[i][j] >= 0.85:
                    duplicate_indices.append(j)
            
            if duplicate_indices:
                is_duplicate = True
                reasons.append("Semantic near-duplicate of another review in this batch")

            # Feature 2: Generic review detection
            if analyze_generic(trimmed_review):
                is_generic = True
                reasons.append("Generic promotional phrase with no meaningful product feedback")

            # Feature 3: Review length analysis
            if char_count < 20 or word_count < 4:
                is_short = True
                reasons.append("Review is excessively brief, containing too little details")

            # Feature 4: Repeated keyword detection
            repeated, rep_word = analyze_repetition(trimmed_review)
            if repeated:
                has_repetition = True
                reasons.append(f"Spammy keyword repetition detected for word '{rep_word}'")

            # Feature 5 & 6: Sentiment and embedding metrics
            sentiment = sentiment_results[i]
            sentiment_label = sentiment['label']
            sentiment_score = sentiment['score']
            
            # Extremely polarized sentiment check
            is_extreme_sentiment = sentiment_score > 0.98
            if is_extreme_sentiment and (is_generic or is_short):
                reasons.append(f"Highly polarized {sentiment_label.lower()} sentiment combined with thin generic text")

            # 7 & 8: Classification Decision & Confidence Score
            # Establish suspicious weight score
            suspicion_score = 0
            if is_duplicate:
                suspicion_score += 4
            if has_repetition:
                suspicion_score += 3
            if is_generic and is_short:
                suspicion_score += 3
            elif is_generic:
                suspicion_score += 1.5
            elif is_short:
                suspicion_score += 1
                
            # Final Classification
            if suspicion_score >= 3:
                prediction = "Fake"
                # Compute confidence based on severity of flags
                confidence = 60 + (suspicion_score * 8)
                confidence = min(98, confidence)
            elif suspicion_score >= 1.5:
                # Borderline case - e.g. duplicate or just generic with some length
                prediction = "Fake"
                confidence = 55 + (suspicion_score * 5)
            else:
                prediction = "Real"
                # If they have no suspicion flags, confidence is very high
                if suspicion_score == 0:
                    confidence = 85 + (sentiment_score * 13)
                else:
                    # Minor warning flags (just short but not generic, etc.)
                    confidence = 65 + (sentiment_score * 10)
                confidence = min(99, confidence)

            # Format final reasons lists
            if not reasons:
                reasons.append("Natural text pattern and unique review structure")

            analysis_output.append({
                "review": review,
                "prediction": prediction,
                "confidence": float(confidence),
                "reason": reasons,
                "is_duplicate": is_duplicate,
                "is_generic": is_generic
            })

        # Output final array as JSON to stdout
        print(json.dumps(analysis_output))

    except Exception as e:
        print(json.dumps({"error": f"Internal Python execution error: {str(e)}"}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
