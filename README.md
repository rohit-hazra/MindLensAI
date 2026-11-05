<div align="center">
  <img src="public/MindLensAI_Logo.png" alt="MindLens AI" width="120" />

  <h1>MindLens AI</h1>
  <h3>Making model decisions easier to inspect, understand, and discuss.</h3>

  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&amp;logoColor=white" alt="React 19" /></a>
  <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&amp;logoColor=white" alt="Vite 8" /></a>
  <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-ML%20service-009688?logo=fastapi&amp;logoColor=white" alt="FastAPI ML service" /></a>
  <a href="#important-safety-note"><img src="https://img.shields.io/badge/Use-Research%20demo-orange" alt="Research demo" /></a>
</div>

<br />

MindLens AI is an explainable-AI research demonstration for exploring text-based suicidal-ideation classification. It combines a thoughtful, responsive interface with an API layer and an interpretable machine-learning service—so a prediction can be examined alongside the words and context that influenced it.

> [!WARNING]
> MindLens AI is a research demonstration, **not** a medical device, clinical assessment, crisis service, or substitute for professional care. Do not use it to make decisions about a person's safety or treatment.

## What it offers

- **Clear, considered interface** — an accessible experience for entering a short caption and reviewing its analysis.
- **Explainable predictions** — Integrated Gradients surfaces influential words and short contextual phrases, rather than presenting a score without context.
- **Separation of concerns** — React handles the experience, Express validates and proxies requests, and FastAPI serves the model.
- **Fail-closed model behavior** — when model files cannot load, the service returns an error instead of fabricating a prediction.
- **Research companion page** — outlines the method, architecture, model comparison, and evaluation-oriented context.

## Architecture

```text
Browser (React + Vite)
          │  POST /api/analyze
          ▼
Express API — validation, timeout handling, proxy
          │  POST /predict
          ▼
FastAPI ML service — RoBERTa → BiGRU → Context Attention → Classifier
          │
          └── Integrated Gradients explanations
```

## Quick start

### 1. Install the JavaScript dependencies

```bash
npm install
```

### 2. Start the web app and API

```bash
npm run dev
```

This starts:

| Service | Address |
| --- | --- |
| React client | `http://localhost:5173` |
| Express API | `http://localhost:5000` |

### 3. Start the ML service in another terminal

```powershell
cd ml_service
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

On macOS or Linux, activate the environment with `source venv/bin/activate` instead.

## Model artifacts

The ML service expects the following local files:

```text
ml_service/saved_model/
├── classifier_weights.pt
└── tokenizer/
    ├── tokenizer.json
    └── tokenizer_config.json
```

These artifacts are intentionally excluded from Git because they are large supplied model files. Place them in the structure above before starting the ML service. Check its readiness at `http://127.0.0.1:8000/health`.

## Configuration

The Express server works with sensible local defaults. To override them, create a root `.env` file:

```env
SERVER_PORT=5000
ML_SERVICE_URL=http://127.0.0.1:8000
```

`.env` is ignored by Git, so private local configuration stays local.

## API reference

| Endpoint | Description |
| --- | --- |
| `GET /api/health` | Confirms that the Express API is running and reports its ML-service target. |
| `POST /api/analyze` | Validates text (up to 500 characters) and forwards it for inference. |
| `GET /health` | Reports ML-service and model-loading status. |
| `POST /predict` | Runs inference and returns the prediction, confidence, risk score, and attribution data. |

Example request:

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"Example text for research use."}'
```

## Project structure

```text
├── src/                  # React views, layout, and styling
├── public/               # Logos, icons, and research assets
├── server/               # Express API proxy and input validation
├── ml_service/           # FastAPI inference service and Python requirements
├── scripts/dev.mjs       # Starts client and API together
└── .gitignore            # Excludes local secrets, dependencies, and model files
```

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the React client and Express API together. |
| `npm run client` | Run only the Vite client. |
| `npm run server` | Run only the Express API. |
| `npm run build` | Build the production frontend. |
| `npm run lint` | Run ESLint across the project. |
| `npm run preview` | Preview the production frontend build. |

## Technology

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React
- **API:** Node.js, Express, CORS, dotenv
- **ML service:** Python, FastAPI, PyTorch, Transformers
- **Interpretability:** Integrated Gradients

## Important safety note

The topic handled by this project is sensitive. Model confidence is not evidence of clinical validity, and explanation values are not proof of causality. Any real-world deployment would require rigorous dataset governance, bias and safety evaluation, privacy protections, human oversight, clinical review, and an appropriate crisis-escalation process.

---

<div align="center">
  Built as an explainable-AI research demonstration.
</div>
