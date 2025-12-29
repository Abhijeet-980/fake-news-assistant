# 🛡️ CrediReader - AI-Powered Fake News Detection

[![Live Demo](https://img.shields.io/badge/Demo-Live-green)](https://your-app-url.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**CrediReader** is an intelligent fake news detection tool that combines AI classification, fact-checking databases, and reverse image search to help users verify news credibility.

![CrediReader Preview](https://via.placeholder.com/800x400?text=CrediReader+Preview)

---

## ✨ Features

### 🧠 AI-Powered Analysis
- **Gemini AI Classification** - Detects satire, fiction, misleading content, opinion, and propaganda
- **Content Analysis** - Identifies clickbait, emotional manipulation, sensational language
- **Date Context Awareness** - AI understands current date to avoid false positives

### 🔍 Multi-Source Verification
- **Google Fact Check API** - Verifies claims against global fact-check database
- **Trusted Source Database** - 50+ verified news sources (BBC, Reuters, TOI, India Today, etc.)
- **Domain Reputation Scoring** - Automatic credibility boost for trusted publishers

### 🖼️ Smart Image Verification
- **Reverse Image Search** - Uses Google Vision API to detect recycled images
- **Wire Service Detection** - Identifies Reuters, AP, Getty photos (normal reuse)
- **Same-Domain Filtering** - Ignores legitimate publisher image reuse
- **Suspicious Image Alerts** - Flags images appearing on 5+ unrelated websites

### 📊 Transparent Scoring
- **0-100 Credibility Score** - Color-coded results (Green/Yellow/Red)
- **Detailed Reasoning** - Shows exactly why score increased/decreased
- **Critical Thinking Prompts** - Questions to encourage verification
- **Action Recommendations** - What to do next

### 📱 Social Sharing
- **Share Card** - Pre-formatted messages with score and article info
- **Multi-Platform** - Twitter/X, WhatsApp, Facebook, LinkedIn
- **One-Click Copy** - Copy result with feedback

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INPUT                               │
│              (News URL or Text Content)                     │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (React + Vite)                    │
└─────────────────────────────┬───────────────────────────────┘
                              │ REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Node.js + Express)                    │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ AI Analyzer  │ │ Fact Checker │ │Image Analyzer│        │
│  │ (Gemini)     │ │ (Google API) │ │ (Vision API) │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                         │                                   │
│                         ▼                                   │
│              ┌──────────────────┐                          │
│              │  Scoring Engine  │                          │
│              │  (0-100 Score)   │                          │
│              └──────────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- API Keys (see below)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/fake-news-assistant.git
cd fake-news-assistant
```

### 2. Setup Backend
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your API keys
```

### 3. Setup Frontend
```bash
cd frontend
npm install

# Create .env file (optional for local development)
echo "VITE_API_URL=http://localhost:3001" > .env
```

### 4. Run Development Servers
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Open in Browser
Navigate to `http://localhost:5173`

---

## 🔑 API Keys Required

| Key | Get It From | Purpose |
|-----|-------------|---------|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) | AI content classification |
| `GOOGLE_FACTCHECK_API_KEY` | [Google Cloud Console](https://console.cloud.google.com) | Fact-check database |
| `GOOGLE_VISION_API_KEY` | [Google Cloud Console](https://console.cloud.google.com) | Image verification |

### Backend `.env` file:
```env
GEMINI_API_KEY=your_gemini_key_here
GOOGLE_FACTCHECK_API_KEY=your_factcheck_key_here
GOOGLE_VISION_API_KEY=your_vision_key_here
PORT=3001
```

---

## 📁 Project Structure

```
fake-news-assistant/
├── backend/
│   ├── analyzers/
│   │   ├── aiAnalyzer.js        # Gemini AI classification
│   │   ├── factCheckAnalyzer.js # Google Fact Check API
│   │   ├── imageAnalyzer.js     # Vision API reverse image search
│   │   ├── languageAnalyzer.js  # Clickbait/sentiment detection
│   │   ├── scoringEngine.js     # Combines all signals
│   │   └── urlExtractor.js      # Article content fetcher
│   ├── data/
│   │   └── trusted_sources.json # Trusted news domains
│   ├── server.js                # Express API server
│   └── .env.example             # Environment template
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ScoreCircle.jsx  # Animated score display
│   │   │   └── SkeletonLoader.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── AnalyzingPage.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── MethodologyPage.jsx
│   │   │   └── PrivacyPage.jsx
│   │   └── App.jsx
│   └── index.html
│
└── README.md
```

---

## 🌐 Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set root directory to `frontend`
3. Add environment variable: `VITE_API_URL=https://your-backend-url.railway.app`

### Backend (Railway)
1. Connect GitHub repo to Railway
2. Set root directory to `backend`
3. Add environment variables (all API keys)

---

## 📊 How Scoring Works

```
Base Score: 50/100

Positive Signals:
  + Trusted source domain: +15
  + No fact-check disputes: +10
  + Original images: +5
  + Verified author: +5

Negative Signals:
  - AI detected as satire/fake: -30 to -40
  - Sensational language: -10
  - Recycled/suspicious images: -15
  - Unknown source: -10
  - Clickbait patterns: -10

Final Score: Clamped to 0-100
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for AI classification
- [Google Fact Check Tools](https://toolbox.google.com/factcheck/) for fact verification
- [Google Cloud Vision](https://cloud.google.com/vision) for image analysis

--

Build By Team Breaking !!!!!!!!!!!!