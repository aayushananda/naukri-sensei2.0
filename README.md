# 🎯 Naukri Sensei — AI Placement Prep System

An end-to-end AI-powered placement preparation system built for final year students. Naukri Sensei helps you analyze your resume, match it against job descriptions, discover relevant jobs, and prepare for interviews — all powered by a production-grade GenAI backend.

---

## 🚀 Features (Phase 1)

| Feature | Description |
|---|---|
| **Resume Analysis** | Parse PDF/DOCX resumes, score on 100-point model, get LLM-powered qualitative feedback |
| **JD Matching** | Semantic matching between resume and job description using Sentence-BERT embeddings + cosine similarity |
| **Gap Analysis** | RAG pipeline identifies missing skills and keywords between your resume and a target JD |
| **Job Discovery** | Auto-detects your target role and fetches live job listings via JSearch API |
| **Grammar Check** | Detects grammar errors and suggests corrections using language_tool_python |

---

## 🏗️ Architecture

```
User uploads Resume (PDF/DOCX)
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
                           └────────┬────────┘
                                    │
                                    ▼
                           ┌─────────────────┐
                           │    main.py      │  ← FastAPI
                           │  3 endpoints    │
                           └─────────────────┘
```

---

## 🔑 Key Design Decisions

**Why section-based chunking over fixed-size?**
Resumes have inherent semantic structure — Education, Experience, Projects, Skills. Fixed-size chunking risks splitting sections mid-thought. Section-based chunking preserves complete semantic units.

**Why no LangChain?**
LangChain abstracts the exact internals that matter for explainability. Every component here — embedding, chunking, similarity, prompting — is built from scratch and fully defensible.

**Why no Vector Database?**
Single-resume use case processed in real-time. In-memory cosine similarity is appropriate. A vector database would be over-engineering for this scope.

**Why temperature=0 for analysis?**
Deterministic outputs — the same resume should receive the same score every time. Temperature=0.7 is used only for creative tasks like bullet point rewriting.

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

**Input:** `file` (PDF or DOCX)

**Returns:**
```json
{
  "resume_text": "...",
  "score": 88,
  "feedback": ["..."],
  "llm_analysis": {
    "strengths": ["..."],
    "weaknesses": ["..."],
    "improvements": ["..."],
    "shortlisting_verdict": "would shortlist",
    "verdict_reason": "..."
  },
  "grammar_errors": [{"message": "...", "context": "...", "suggestions": ["..."]}]
}
```

---

### `POST /match-resume`
Match resume against a specific job description.

**Input:** `jd_text` (Form), `file` (optional) or `resume_text` (optional)

**Returns:** Everything from `/analyze-resume` plus:
```json
{
  "resume_match": {
    "match_score": 73.5,
    "most_relevant_section": "projects",
    "relevant_text": "..."
  },
  "gap_in_resume": {
    "gaps": ["..."],
    "improvements": ["..."],
    "suggested_keywords": ["..."]
  }
}
```

---

### `POST /search-jobs`
Auto-detect role from resume and find live job listings.

**Input:** `resume_text` (Form)

**Returns:**
```json
{
  "detected_role": "AI Engineer",
  "jobs": [{"title": "...", "company": "...", "description": "..."}]
}
```

---

## 🗺️ User Flow

```
Landing Page
    │
    ├──► "Analyze My Resume"
    │         │
    │         ▼
    │    /analyze-resume
    │    score + feedback + LLM analysis
    │         │
    │         ▼
    │    "Find Relevant Jobs?"
    │         │
    │         ▼
    │    /search-jobs → job list
    │         │
    │         ▼
    │    User clicks job
    │         │
    │         ▼
    │    /match-resume → full match + gap analysis
    │
    └──► "Have a JD? See How You Fit"
              │
              ▼
         /match-resume (direct)
         full match + gap analysis
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.10+
- Groq API key (free at [console.groq.com](https://console.groq.com))
- RapidAPI key with JSearch subscription (free tier at [rapidapi.com](https://rapidapi.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/naukri-sensei.git
cd naukri-sensei/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo GROQ_API_KEY=your_groq_key_here > .env
echo RAPIDAPI_KEY=your_rapidapi_key_here >> .env

# Run the server
uvicorn main:app --reload
```

### Test the API
Open `http://localhost:8000/docs` in your browser for interactive Swagger UI.

---

## 📦 Requirements

```
fastapi
uvicorn
pdfplumber
python-docx
python-multipart
sentence-transformers
numpy
groq
httpx
language-tool-python
python-dotenv
```

---

## 🗂️ Project Structure

```
naukri-sensei/
├── backend/
│   ├── main.py              # FastAPI app, 3 endpoints
│   ├── resume_parser.py     # PDF/DOCX text extraction
│   ├── scorer.py            # Rule-based + LLM scoring
│   ├── matcher.py           # Embeddings + cosine similarity
│   ├── analyzer.py          # RAG gap analysis + job title extraction
│   ├── requirements.txt
│   └── .env                 # API keys (never commit this)
├── frontend/                # React frontend (in progress)
└── README.md
```

---

## 🔮 Roadmap

### Phase 1 (Current)
- [x] Resume parsing (PDF/DOCX)
- [x] Hybrid resume scoring (rule-based + LLM)
- [x] Semantic JD matching via RAG
- [x] Live job discovery via JSearch API
- [ ] Resume builder with LaTeX template + LLM refinement
- [ ] Frontend (in progress)

### Phase 2 (Upcoming)
- [ ] AI mock interview with webcam-based facial confidence scoring
- [ ] Adaptive OA generation with difficulty-calibrated questions and automated evaluation

---

## ⚠️ Known Limitations

- Grammar checker flags technical terms (Groq, FastAPI, JIIT) as spelling errors — display-level issue
- Single chunk retrieval may pick skills section over projects for some JDs
- Scanned PDFs not supported (OCR not implemented)

---

## 🧑‍💻 Built With

- [FastAPI](https://fastapi.tiangolo.com/) — Backend framework
- [Groq API](https://console.groq.com/) — LLM inference (LLaMA 3.1 8B Instant)
- [Sentence-Transformers](https://www.sbert.net/) — Semantic embeddings (all-MiniLM-L6-v2)
- [pdfplumber](https://github.com/jsvine/pdfplumber) — PDF text extraction
- [JSearch API](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) — Live job listings

---

## 📄 License

MIT License — feel free to use, modify, and distribute.
