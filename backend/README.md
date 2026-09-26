# CivicLens backend

CivicLens is a small FastAPI REST API for civic issue reporting, triage, map display, and dashboard analytics. It uses SQLAlchemy with SQLite by default and can use a hosted SQLAlchemy database URL for deployment.

## Architecture

- `app/routes/`: report, analysis, analytics, and map HTTP endpoints.
- `app/models.py`, `schemas.py`, `crud.py`: database model, validation, and data access.
- `app/services/`: deterministic text fallback, modular duplicate matching, and transparent priority scoring.
- `seed.py`: inserts 17 realistic demo reports only when the database is empty.

The built-in analyzer uses transparent keyword rules. It is not a hosted AI model and it does not perform computer vision. `AIService` accepts a provider implementing `analyze_text` and `analyze_image`, so a real provider can be added without changing the routes. Image analysis currently returns an explicit unavailable result.

## Setup

Python 3.10+ recommended.

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python seed.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Swagger UI: <http://localhost:8000/docs>. The database is created automatically on startup. Seed data can be loaded before first startup; seeding is idempotent for a non-empty database.

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./civiclens.db` | SQLAlchemy connection URL |
| `FRONTEND_ORIGINS` | `http://localhost:5173` | Comma-separated CORS origins |
| `PORT` | `8000` | Deployment server port |

Render/Railway start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (set the working directory to `backend`).

## API

- `POST /api/reports` — create a report. Category and severity are optional; fallback text rules infer them when omitted.
- `GET /api/reports?category=ROAD_DAMAGE&severity=HIGH&status=NEW&search=pothole&limit=50&offset=0` — filter and page reports.
- `GET /api/reports/{report_id}` — report, AI/fallback analysis, location, priority factors, and potential duplicates.
- `PATCH /api/reports/{report_id}/status` — update status with `{"status":"IN_PROGRESS"}`.
- `POST /api/reports/{report_id}/analyze` — re-run fallback classification and scoring.
- `POST /api/analysis/image` — image provider adapter; fallback explicitly reports that visual analysis is unavailable. Body: `{"image_url":"https://..."}`.
- `GET /api/analytics` — aggregate report counts and resolution metrics.
- `GET /api/map/issues` — compact coordinates and issue status for map markers.
- `GET /docs` — interactive Swagger documentation.

Example create request:

```json
{
  "title": "Large pothole near college entrance",
  "description": "Large pothole causing traffic problems",
  "latitude": 12.9345,
  "longitude": 77.6101,
  "location_name": "Bangalore"
}
```

## Priority and duplicates

Priority is the capped sum of severity (8–30), category public impact (10–25), duplicate count (5 per match, max 15), age (up to 20), and location exposure (5 or 10 for common civic hubs). Duplicate candidates must share category, be within 500 m, and have at least 0.35 description similarity. These values are simple MVP heuristics and can be tuned in their service modules.

## Future AI integration

Implement a provider with `analyze_text(title, description, category=None, severity=None)` and `analyze_image(image_url)` and pass it to `AIService`. Keep provider credentials in environment variables; never commit API keys. Persist a provider/model identifier and validate provider output before applying it in production.

