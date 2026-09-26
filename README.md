# CivicLens

CivicLens pairs the existing Lovable React/Vite interface with a FastAPI API for civic reports, analysis, map issues, and analytics.

## Project layout

- `src/` — existing React frontend and routes.
- `backend/` — FastAPI application, SQLAlchemy models, and seed script.

## Run locally

Start the API in one terminal:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python seed.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Start the frontend in a second terminal from the repository root:

```sh
npm install
npm run dev
```

The frontend runs at <http://localhost:5173>, and FastAPI docs are at <http://localhost:8000/docs>. The frontend reads its API origin from `VITE_API_URL`; copy `.env.example` to `.env.local` to override the default `http://localhost:8000`.

For deployment, run Uvicorn from `backend/` with `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Set `DATABASE_URL` and `FRONTEND_ORIGINS` for the deployment environment.
