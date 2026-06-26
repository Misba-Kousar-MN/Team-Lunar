# AI-Powered Fake Product Review Detection Backend

This repository houses the production-ready, modular, and scalable Node.js/Express + Python AI backend for detecting fake product reviews. It processes e-commerce review lists, evaluates them using a multi-signal AI heuristic, persists histories in MongoDB, and outputs detailed trust statistics along with an overall system Trust Score (0-100).

---

## 🚀 Features

1. **Semantic Near-Duplicate Detection**: Uses sentence-embeddings via Sentence-Transformers to spot copied or closely paraphrased reviews.
2. **Generic Review Detection**: Employs structural matching to flag low-effort generic reviews (e.g., "Very nice", "Best product").
3. **Review Length Analysis**: Penalizes reviews containing fewer than 20 characters.
4. **Repeated Keyword Detection**: Analyzes high lexical frequency ratios to isolate keyword stuffing.
5. **Polarized Sentiment Check**: Captures extreme positivity/negativity relative to context.
6. **Overall Trust Score Calculation**: Computes aggregate trust (0-100) using quality metrics and confidence weights, labeling pools from *Highly Trustworthy* to *Highly Suspicious*.
7. **Secure Express Framework**: Integrated with Helmet headers, CORS, rate limiting, and standard input sanitization.
8. **Centralized Logging & Error Handling**: Captures asynchronous database, execution, and validation errors gracefully with Winston + Morgan logs.

---

## 📁 Architecture Directory Structure

```
backend/
├── config/                  # Configuration loaders and database wrappers
│   ├── config.js
│   └── db.js
├── controllers/             # Express controllers defining business flow
│   └── analysis.controller.js
├── routes/                  # Route entry points mapping controllers
│   └── analysis.route.js
├── models/                  # Mongoose Schema definitions for MongoDB persistence
│   └── analysis.model.js
├── middlewares/             # Express Middlewares (Validation checker, Error interceptor)
│   ├── error.middleware.js
│   └── validation.middleware.js
├── services/                # Reusable Node services (Subprocess AI bridge, Trust metrics)
│   ├── ai.service.js
│   ├── trustScore.service.js
│   └── analysis.service.js
├── utils/                   # Standard logger and Custom AppError classes
│   ├── AppError.js
│   └── logger.js
├── validators/              # Validation schema specifications
│   └── analysis.validator.js
├── python/                  # Python AI Service source
│   ├── requirements.txt
│   └── analyze.py
├── logs/                    # Destination directory for file logs
├── server.js                # Server listener entry point and process lifecycle controller
├── app.js                   # Express application setup and pipeline setup
└── test_integration.js      # Automation verification script
```

---

## 🛠️ Setup & Installation

### Prerequisites
* **Node.js** (v18+ recommended)
* **Python** (v3.9+ recommended)
* **MongoDB** (Local instance or MongoDB Atlas Connection string)

### 1. Install Node.js Dependencies
Navigate to the `backend/` directory and execute:
```bash
npm install
```

### 2. Install Python Dependencies
Install the required AI packages using pip:
```bash
pip install -r python/requirements.txt
```
*(Note: Ensure your Python environment is accessible via `python` or configure `PYTHON_PATH` inside `.env`)*

### 3. Environment Configurations
Create a `.env` file inside the `backend/` folder (you can clone `.env.example`):
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/fake-reviews-detector

# AI Python Service Configuration
# Set the path to your python executable if not on global path
PYTHON_PATH=python

# Security Rate Limiter Configuration (Production)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

---

## ⚡ Running the Backend

### Start Server in Development Mode (Auto-restart)
To run the server with nodemon:
```bash
npm run dev
```

### Start Server in Production Mode
```bash
npm start
```

The server health checking endpoint will be active at: `http://localhost:5000/health`

---

## 🧪 Integration Testing
You can execute the automated test suite to run sample reviews through the AI evaluation pipeline and check database persistence:
```bash
node test_integration.js
```

---

## 📖 API Documentation

### **POST /api/analyze**
Submits a list of reviews to evaluate credibility metrics.

* **Headers**: `Content-Type: application/json`
* **Request Payload**:
```json
{
  "reviews": [
    "This product is amazing! The build quality is top-notch, battery lasts all day, and screen is beautiful.",
    "This product is amazing! The build quality is top-notch, battery lasts all day, and screen is beautiful.",
    "very nice product",
    "worst quality buy buy buy buy buy buy buy bad bad bad bad bad bad bad bad buy buy buy bad bad bad",
    "This is a great product, highly recommended, very nice, excellent product"
  ]
}
```

* **Response (200 OK)**:
```json
{
  "trustScore": 61,
  "recommendation": "Mixed",
  "statistics": {
    "totalReviews": 5,
    "fakeReviews": 3,
    "realReviews": 2,
    "duplicateReviews": 2,
    "genericReviews": 0
  },
  "analysis": [
    {
      "review": "This product is amazing! The build quality is top-notch, battery lasts all day, and screen is beautiful.",
      "prediction": "Fake",
      "confidence": 92,
      "reason": [
        "Semantic near-duplicate of another review in this batch"
      ]
    },
    {
      "review": "This product is amazing! The build quality is top-notch, battery lasts all day, and screen is beautiful.",
      "prediction": "Fake",
      "confidence": 92,
      "reason": [
        "Semantic near-duplicate of another review in this batch"
      ]
    },
    {
      "review": "very nice product",
      "prediction": "Real",
      "confidence": 75,
      "reason": [
        "Review is excessively brief, containing too little details",
        "Highly polarized positive sentiment combined with thin generic text"
      ]
    },
    {
      "review": "worst quality buy buy buy buy buy buy buy bad bad bad bad bad bad bad bad buy buy buy bad bad bad",
      "prediction": "Fake",
      "confidence": 84,
      "reason": [
        "Spammy keyword repetition detected for word 'buy'"
      ]
    },
    {
      "review": "This is a great product, highly recommended, very nice, excellent product",
      "prediction": "Real",
      "confidence": 98,
      "reason": [
        "Natural text pattern and unique review structure"
      ]
    }
  ]
}
```

### Error Responses
* **400 Bad Request** (Validation Error):
  ```json
  {
    "status": "fail",
    "message": "Reviews field is required; All items in the reviews array must be non-empty strings"
  }
  ```
* **500 Internal Server Error** (AI model exception / database offline):
  ```json
  {
    "status": "error",
    "message": "AI Analysis Service failed to execute."
  }
  ```

### **GET /api/history**
Retrieves all saved analysis histories, sorted by newest first.

* **Response (200 OK)**:
```json
{
  "status": "success",
  "results": 1,
  "data": [
    {
      "_id": "6a3ea67638756a862d8461cb",
      "originalReviews": [
        "This product is amazing!..."
      ],
      "trustScore": 61,
      "recommendation": "Mixed",
      "statistics": {
        "totalReviews": 5,
        "fakeReviews": 3,
        "realReviews": 2,
        "duplicateReviews": 2,
        "genericReviews": 0
      },
      "analysis": [
        {
          "review": "This product is amazing!...",
          "prediction": "Fake",
          "confidence": 92,
          "reason": [
            "Semantic near-duplicate of another review in this batch"
          ]
        }
      ],
      "createdAt": "2026-06-26T21:45:02.000Z",
      "updatedAt": "2026-06-26T21:45:02.000Z"
    }
  ]
}
```

### **GET /api/history/:id**
Retrieves a single analysis run by its database ID.

* **Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "_id": "6a3ea67638756a862d8461cb",
    "originalReviews": [ ... ],
    "trustScore": 61,
    "recommendation": "Mixed",
    "statistics": { ... },
    "analysis": [ ... ],
    "createdAt": "2026-06-26T21:45:02.000Z",
    "updatedAt": "2026-06-26T21:45:02.000Z"
  }
}
```

### **DELETE /api/history/:id**
Deletes an analysis log from database history.

* **Response (204 No Content)**: Returns empty response body upon successful deletion.

