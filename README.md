# 🛡️ ReviewTrust AI

AI-Powered Fake Review Detection & Product Trust Analysis Platform.

[![React](https://img.shields.io/badge/Frontend-React.js-blue?logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-emerald?logo=fastapi)](https://fastapi.tiangolo.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)](https://www.mongodb.com)
[![Python](https://img.shields.io/badge/AI%2FNLP-Python-blue?logo=python)](https://www.python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 Problem Statement

In the modern e-commerce landscape, buyer reviews represent a critical pillar of decision-making. However, marketplaces are increasingly flooded with **manipulated rating signals, computer-generated bot spam, coordinated review bursts, and duplicate text templates**. Traditional aggregators only display raw average ratings (e.g., 4.5 stars), offering no distinction between authentic customer feedback and artificially inflated review profiles. Shoppers are left vulnerable to deceptive marketing practices, resulting in lower shopping confidence and high product returns.

## 💡 Solution

**ReviewTrust AI** is a comprehensive auditing platform that runs multi-level linguistic check pipelines to filter review manipulation. 
Instead of relying on simple averages, the engine crawls listing data in real time, evaluates textual signatures using deep learning model classifiers, checks seller credibility indicators, and returns:
1. **Explainable AI (XAI)** reports showing exact reasons for review classification.
2. A single, unified **Product Trust Score** (0-100) reflecting authentic customer sentiment.
3. An **Overall Shopping Confidence** scale grading buy risk as *Low Risk*, *Caution*, or *High Risk*.

---

## ✨ Features

- **Fake Review Detection**: Machine learning classifiers identifying linguistic templates, spam keyword repetitions, and polarized sentiment shifts.
- **Product Trust Score**: Weighted trust score calculations discounting unverified reviews, copy-pasted blocks, and suspicious bursts.
- **Overall Shopping Confidence**: Unified confidence rating matching buy risk categories.
- **Explainable AI (XAI)**: Detailed breakdown explaining the exact calculations behind every score.
- **Seller Credibility**: Credibility index checking seller performance history and marketplace fulfillment methods.
- **Marketplace Verification**: Direct validation checking platform badges (e.g., *Amazon Fulfilled*, *Flipkart Assured*).
- **Product Authenticity Signals**: Flags anomalous review patterns, spelling templates, and duplicate reviews.
- **AI Trust Signals**: Transparent breakdown list tracing positive and negative markers (diversity, uniqueness, pricing, and origin checks).
- **Interactive Dashboard**: Modern SaaS analytics reporting dashboard complete with pie charts, filter options, and highlighted reviews.
- **Product Redirect**: Fast links to original listings with integrated marketplace indicators.

---

## 🛠️ Tech Stack

### Frontend
* **React.js** & **Vite** (Next-gen frontend build environment)
* **Tailwind CSS** (Premium utility styling engine)
* **Lucide React** (Modern clean design icon set)
* **Recharts** (Interactive responsive chart visualization)

### Backend
* **Python** (Subprocess AI bridge & data services)
* **FastAPI** (High performance backend API)
* **MongoDB** (Analysis history and cache document storage)
* **Pydantic** (Robust data parsing and validation schemas)

### AI/NLP Engine
* **DistilBERT** (Linguistic sentiment class models)
* **Sentence Transformers** (Semantic near-duplicate text embedding alignment)
* **TF-IDF & Cosine Similarity** (Spam repetition tracking)
* **Heuristic AI Scoring** (Weighted multi-signal trust formulas)

---

## 📐 Architecture

The platform architecture coordinates decoupled UI states with Node/Python API services:

```text
       User Interaction
              ↓
      ┌───────────────┐
      │ React.js App  │  ← [Vite / Tailwind CSS]
      └───────────────┘
              ↓ (API calls)
      ┌───────────────┐
      │ FastAPI Server│  ← [Node Express API Wrapper]
      └───────────────┘
              ↓ (IPC Subprocess Run)
      ┌───────────────┐
      │ AI NLP Engine │  ← [Python / BERT / Sentence-Transformers]
      └───────────────┘
        ↓           │
┌───────────┐  ┌────▼──────┐
│ MongoDB   │  │ Dashboard │
└───────────┘  └───────────┘
```

---

## ⚡ AI Workflow

```text
   Product URL input by user
              ↓
    Product Data Extraction (Live Apify Layer / Fallback cache)
              ↓
       Review Processing & Cleaning
              ↓
  Semantic Duplicate Detection (Sentence-Transformers)
              ↓
      Vocabulary Diversity Auditing (Lexical checks)
              ↓
     Review Specificity Filters (Filler extraction)
              ↓
  Marketplace Verification Check (Fulfilled status check)
              ↓
     Price Consistency Check (Market index match)
              ↓
    Calculate Weighted Product Trust Score (0-100)
              ↓
    Formulate Overall Shopping Confidence Risk Tier
              ↓
 Render Explainable Dashboard with Interactive Trust Signals
```

---

## 📂 Project Structure

```text
Team-Lunar/
├── backend/                   # FastAPI and Express Node Backend
│   ├── config/                # Database wrappers and configurations
│   ├── controllers/           # Express controllers (Analysis)
│   ├── routes/                # Endpoint mapping files
│   ├── models/                # Mongoose Database schemas
│   ├── services/              # AI subprocess and trust score engines
│   ├── utils/                 # Winston logging and helpers
│   ├── python/                # Python NLP engine
│   │   ├── requirements.txt   # Python packages configuration
│   │   └── analyze.py         # Semantic NLP pipelines
│   └── app.js                 # Server entry application setup
├── dist/                      # Frontend production assets build
├── public/                    # Static assets & public resources
├── src/                       # React frontend source files
│   ├── assets/                # Design layout style sheets
│   ├── components/            # Reusable React components (Navbar, TrustMeter, etc.)
│   ├── pages/                 # Layout components (Home, Dashboard)
│   ├── mockData.js            # Embedded offline mock datasets
│   └── App.jsx                # Application root state controller
├── package.json               # Frontend dependencies manifest
├── tailwind.config.js         # Design system configuration
└── vite.config.js             # Vite compiler config
```

---

## 🔧 Installation & Setup

### Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (v3.9+ recommended)
- **MongoDB** (Running local service or MongoDB Atlas URI connection string)

### 1. MongoDB Setup
Ensure your MongoDB server is running:
```bash
# Example running local MongoDB daemon on Windows/macOS/Linux
mongod --dbpath <your-data-path>
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Install Python AI library dependencies:
   ```bash
   pip install -r python/requirements.txt
   ```
4. Create a `.env` file in the `backend/` folder matching configurations:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/reviewtrust-db
   PYTHON_PATH=python
   ```

### 3. Frontend Setup
1. Navigate back to the project root:
   ```bash
   cd ..
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```

### 4. Running the Platform Locally
To start the developer environment:
- **Run Backend Server**:
  ```bash
  cd backend
  npm run dev
  ```
- **Run Frontend Application**:
  ```bash
  # From root directory in a separate terminal window
  npm run dev
  ```
- Open your browser and navigate to `http://localhost:5173/` to view the landing page.

---

## 🔗 Sample Product Links

Use these exact product URLs in the home search bar to query pre-loaded mock analyses:

### 🛍️ Amazon Listings
1. **Apple iPhone Air (256 GB, White)**  
   `https://amzn.in/d/02h7nez0`
2. **Apple MacBook Air 15″ (M3, Space Grey)**  
   `https://amzn.in/d/0foxJxiU`
3. **Samsung 633L Side-by-Side Refrigerator**  
   `https://amzn.in/d/06npzt2c`
4. **Samsung 12kg Front Load Washer**  
   `https://amzn.in/d/0i5DJvEV`
5. **Canon EOS R50 Mirrorless Camera**  
   `https://amzn.in/d/07sjDcj9`
6. **LG OLED B4 55″ Smart TV**  
   `https://amzn.in/d/01yzQRZc`

### 🛒 Flipkart Listings
7. **LG DFB424FP Dishwasher**  
   `https://dl.flipkart.com/dl/lg-dfb424fp-free-standing-14-place-settings-intensive-kadhai-cleaning-no-pre-rinse-required-dishwasher/p/itmffag4ttb5fkm3?pid=DSWFFAG4YRKVBK83`
8. **Apple iPad 9th Gen (256 GB)**  
   `https://dl.flipkart.com/dl/apple-ipad-9th-gen-256-gb-rom-10-2-inch-4g-a13-bionic-chip-space-grey/p/itmd7d2c4840fa04?pid=TABG6VNCJCNHYMPD`
9. **Sleepyhead Kiki 2-Seater Sofa**  
   `https://dl.flipkart.com/dl/sleepyhead-kiki-designed-duroflex-high-density-foam-premium-fabric-2-seater-sofa/p/itme155ea03743b3?pid=SOFGFGHYDVG5TC38`

---

## 🔮 Future Scope

- **Live Product Retrieval using Apify**: Complete scraping integration mapping active catalog reviews from Amazon/Flipkart.
- **Browser Extension**: Real-time pop-up extension to display Trust Scores directly on e-commerce product pages.
- **Mobile Application**: Dedicated Android/iOS scanner application parsing product barcodes.
- **Multi-language Support**: Expanding local NLP models to parse Hindi, Spanish, and custom regional e-commerce text inputs.
- **Real-time Seller Monitoring**: Live dashboards tracking listing hijackings, merchant rating spikes, and review velocity metrics.
- **LLM-powered Explainability**: Using lightweight localized LLMs to output detailed, natural-language reasoning paragraphs for Trust Scores.

---

## 👥 Team

**Team Lunar**
- **Misba Kousar MN**
- **Syeda Ayman**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
