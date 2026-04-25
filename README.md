# 🎯 Naukri Sensei — AI Placement Prep System

An end-to-end AI-powered placement preparation system built for final year students. Naukri Sensei helps you analyze your resume, match it against job descriptions, discover relevant jobs, and prepare for interviews — all powered by a production-grade GenAI backend and a modern React frontend.

---

## 🚀 Features (Phase 1)

| Feature | Description |
|---|---|
| **Resume Analysis** | Parse PDF/DOCX resumes, score on 100-point model, get LLM-powered qualitative feedback |
| **JD Matching** | Semantic matching between resume and job description using Sentence-BERT embeddings + cosine similarity |
| **Gap Analysis** | RAG pipeline identifies missing skills and keywords between your resume and a target JD |
| **Job Discovery** | Auto-detects your target role and fetches live job listings via JSearch API |
| **Grammar Check** | Detects grammar errors and suggests corrections using `language_tool_python` |
| **Interactive UI** | Modern React-based SPA with premium dark mode, glassmorphism, GSAP animations, and seamless routing |

---

## 🏗️ Architecture

```
User uploads Resume (PDF/DOCX)
        │
        ▼
┌─────────────────┐
│  React Frontend │  ← Vite, react-router-dom, GSAP
└────────┬────────┘
         │ multipart/form-data
         ▼
┌─────────────────┐
│  FastAPI Backend│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  resume_parser  │  ← pdfplumber / python-docx
└────────┬────────┘
         │ raw text
         ▼
┌─────────────────┐        ┌─────────────────┐
│    scorer.py    │        │   matcher.py    │
│                 │        │                 │
│ • Rule checks   │        │ • Section-based │
│ • LLM analysis  │        │   chunking      │
│ • Grammar check │        │ • SBERT embeds  │
└─────────────────┘        │ • Cosine sim    │
                           └────────┬────────┘
                                    │ relevant chunk
                                    ▼
                           ┌─────────────────┐
                           │  analyzer.py    │
                           │                 │
                           │ • RAG pipeline  │
                           │ • Gap analysis  │
                           │ • Job title ext │
                           └─────────────────┘
```

---

## 🔑 Key Design Decisions

**Frontend: React + Vite + Vanilla CSS**
A lightweight Single Page Application (SPA) architecture. Styling is achieved using Vanilla CSS and CSS variables for tokens instead of heavy frameworks, achieving a premium "Professional AI" dark theme. State is orchestrated via custom hooks, and complex data such as job matching results are cached in component state to avoid redundant network calls.

**Why section-based chunking over fixed-size?**
Resumes have inherent semantic structure — Education, Experience, Projects, Skills. Fixed-size chunking risks splitting sections mid-thought. Section-based chunking preserves complete semantic units.

**Why no LangChain?**
LangChain abstracts the exact internals that matter for explainability. Every component here — embedding, chunking, similarity, prompting — is built from scratch and fully defensible.

**Why no Vector Database?**
Single-resume use case processed in real-time. In-memory cosine similarity is appropriate. A vector database would be over-engineering for this scope.

**Why Groq over OpenAI?**
Free tier with fast inference, identical API structure. Easy to swap to OpenAI if needed.

---

## 🧠 RAG Pipeline

```
JD Text ──► Embed (SBERT) ──────────────────────────────┐
                                                         ├──► Cosine Similarity
Resume ──► Section Chunks ──► Embed each (SBERT) ───────┘
                                    │
                              Most relevant chunk
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │  LLM Prompt (Groq API)        │
                    │                               │
                    │  Full JD + Relevant Chunk     │
                    │  → gaps                       │
                    │  → improvements               │
                    │  → suggested_keywords         │
                    └───────────────────────────────┘
```

---

## 📊 Scoring Model

| Check | Type | Deduction |
|---|---|---|
| Missing contact info | Fatal | −15 |
| No projects section | Fatal | −15 |
| No education section | Fatal | −15 |
| Skills not reflected in projects | Fatal | −15 |
| No action verbs in bullets | Quality | −6 |
| No quantification in bullets | Quality | −6 |
| Resume exceeds 1 page | Quality | −6 |
| Grammar errors (5+) | Quality | −6 |

**Start: 100 points. Worst possible: 4 points.**

---

## 🛣️ API Endpoints

### `POST /analyze-resume`
Upload a resume and get full analysis.

### `POST /match-resume`
Match resume against a specific job description.

### `POST /search-jobs`
Auto-detect role from resume and find live job listings.

*(See backend code for detailed request/response schemas)*

---

## 🗺️ User Flow

```
Landing Page (/)
    │
    ├──► "Analyze My Resume"
    │         │
    │         ▼
    │    /analyze
    │    score + feedback + LLM analysis
    │         │
    │         ▼
    │    "Find Matching Jobs"
    │         │
    │         ▼
    │    List of Jobs (Expandable)
    │         │
    │         ▼
    │    User clicks "See Fit"
    │         │
    │         ▼
    │    In-line Match Panel fetches full match + gap analysis
    │
    └──► "Match Job"
              │
              ▼
         /match (direct)
         full match + gap analysis via Form Input
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- Groq API key (free at [console.groq.com](https://console.groq.com))
- RapidAPI key with JSearch subscription (free tier at [rapidapi.com](https://rapidapi.com))

### Backend Installation

```bash
cd naukri-sensei/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo GROQ_API_KEY=your_groq_key_here > .env
echo RAPIDAPI_KEY=your_rapidapi_key_here >> .env

# Run the server
uvicorn main:app --reload
```
Open `http://localhost:8000/docs` in your browser for interactive Swagger UI.

### Frontend Installation

```bash
cd naukri-sensei/frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser to view the app.

---

## 🗂️ Project Structure

```
naukri-sensei/
├── backend/                 # FastAPI Application
│   ├── main.py              # API routes
│   ├── resume_parser.py     # PDF/DOCX text extraction
│   ├── scorer.py            # Rule-based + LLM scoring
│   ├── matcher.py           # Embeddings + cosine similarity
│   ├── analyzer.py          # RAG gap analysis + job title extraction
│   ├── requirements.txt
│   └── .env                 
├── frontend/                # React Vite Application
│   ├── src/
│   │   ├── components/      # Reusable UI (JobCard, FileUploader, etc.)
│   │   ├── hooks/           # Custom state managers (useResumeAnalysis, useJdMatch)
│   │   ├── pages/           # Views (Landing, ResumeAnalysis, JdMatch)
│   │   ├── services/        # Backend API wrappers
│   │   ├── App.jsx          # React Router setup
│   │   └── main.jsx         # Entry point
│   ├── index.css            # Global design tokens and styles
│   └── package.json
└── README.md
```

---

## 🔮 Roadmap

### Phase 1 (Completed)
- [x] Resume parsing (PDF/DOCX)
- [x] Hybrid resume scoring (rule-based + LLM)
- [x] Semantic JD matching via RAG
- [x] Live job discovery via JSearch API
- [x] Frontend Implementation (React + Vite, Premium Dark Mode UI)

### Phase 2 (Upcoming)
- [ ] Resume builder with LaTeX template + LLM refinement
- [ ] AI mock interview with webcam-based facial confidence scoring
- [ ] Adaptive OA generation with difficulty-calibrated questions and automated evaluation

---

## ⚠️ Known Limitations

- Grammar checker flags technical terms (Groq, FastAPI, JIIT) as spelling errors — display-level issue
- Single chunk retrieval may pick skills section over projects for some JDs
- Scanned PDFs not supported (OCR not implemented)

---

## 🧑‍💻 Built With

### Frontend Stack
- **[React](https://react.dev/)** + **[Vite](https://vitejs.dev/)** — UI Framework & Build Tool
- **[React Router](https://reactrouter.com/)** — Client-side Navigation
- **[GSAP](https://gsap.com/)** — Micro-animations & Interactions
- **[Lucide React](https://lucide.dev/)** — Iconography
- **Vanilla CSS** — Custom styling with CSS Variables (No external CSS framework)

### Backend Stack
- **[FastAPI](https://fastapi.tiangolo.com/)** — Backend framework
- **[Groq API](https://console.groq.com/)** — LLM inference (LLaMA 3.1 8B Instant)
- **[Sentence-Transformers](https://www.sbert.net/)** — Semantic embeddings (`all-MiniLM-L6-v2`)
- **[pdfplumber](https://github.com/jsvine/pdfplumber)** — PDF text extraction
- **[JSearch API](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)** — Live job listings
- **[language_tool_python](https://pypi.org/project/language-tool-python/)** — Grammar checking

---

## 📄 License

MIT License — feel free to use, modify, and distribute.
