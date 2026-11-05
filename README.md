# MindLens AI

MindLens AI is a research demonstration interface for **Context-Aware Explainable AI for Suicidal Ideation Detection**. It presents a React client, an Express proxy API, and a FastAPI model service around the supplied DistilRoBERTa → BiGRU → Context Attention → Classifier architecture.

## Current state

The UI is complete and responsive across the requested pages. The model artifacts and research PDF are not present in this workspace. The ML service therefore fails closed and does not invent predictions. Place the supplied checkpoint at `ml_service/saved_model/classifier_weights.pt` and the tokenizer files at `ml_service/saved_model/tokenizer/`, then complete the architecture loader from the checkpoint's actual `state_dict` and training configuration.

## Run React + Express together

```powershell
npm install
npm run dev
```

The root install also installs the Express workspace dependencies in `server/`.

This starts React on `http://localhost:5173` and Express on `http://localhost:5000`. The API listens on port `5000` by default. `POST /api/analyze` validates the caption and forwards it to the ML service. `GET /api/health` reports API status.

## Run the ML service separately

```powershell
cd ml_service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

`POST /predict` is intentionally unavailable until the real model architecture can be reconstructed safely from the supplied checkpoint. No mock outputs are returned.

## Project structure

```text
src/                 React pages, layout, responsive styling
server/              Express API proxy and validation
ml_service/app.py    FastAPI model boundary
ml_service/saved_model/  Place supplied model artifacts here
research/            Place the real paper PDF here
```

## Environment

Copy `.env.example` to `.env` and adjust `SERVER_PORT` and `ML_SERVICE_URL` if needed. MongoDB is optional and is not used by the core demonstration.

## Important limitations

This is a research demonstration, not a medical or clinical system. Results and explanations must come from the trained model service. Evaluation metrics and paper sections are left unpopulated until the actual project files are supplied.
