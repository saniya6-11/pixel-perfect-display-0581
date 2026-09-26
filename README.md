# CivicLens

### AI-Powered Civic Intelligence for Smarter, Faster Local Issue Resolution

> **CivicLens transforms citizen-reported civic problems into structured, prioritized, and actionable intelligence.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-CivicLens-2ea44f?style=for-the-badge)](https://civiclens-inky.vercel.app/)
[![API](https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge)](https://civiclens-api-hzns.onrender.com/)
[![API Docs](https://img.shields.io/badge/API%20Docs-Swagger-85EA2D?style=for-the-badge)](https://civiclens-api-hzns.onrender.com/docs)

---

## 🚨 The Problem

Civic issues such as potholes, garbage accumulation, broken streetlights, water leaks, and unsafe infrastructure are often reported through fragmented channels.

This creates three recurring problems:

- Important issues are difficult to prioritize.
- Multiple citizens may report the same problem.
- Decision-makers lack a unified view of **where problems are occurring and which ones require attention first.**

**CivicLens addresses this gap by adding an intelligence layer between citizen reports and civic action.**

---

## 💡 The Solution

CivicLens is a full-stack civic technology platform that analyzes local infrastructure reports and converts them into actionable information.

A submitted report can be:

**Reported → Analyzed → Prioritized → De-duplicated → Mapped → Tracked**

The platform combines AI-assisted analysis, transparent priority scoring, duplicate detection, geographic visualization, and analytics into a single workflow.

---

## ✨ Key Features

### 🤖 AI-Assisted Issue Analysis

CivicLens analyzes submitted reports to determine:

- Issue category
- Severity
- Confidence
- Detected issue
- Recommended action

---

### 🎯 Transparent Priority Scoring

Instead of treating every complaint equally, CivicLens calculates a priority score using multiple factors:

- Severity
- Public impact
- Duplicate reports
- Report age
- Location exposure

This makes prioritization **explainable rather than a black box.**

---

### 🔁 Duplicate Detection

Multiple citizens may report the same civic problem.

CivicLens identifies **potentially overlapping reports** and surfaces duplicate counts so repeated complaints can be consolidated instead of treated as separate incidents.

---

### 🗺️ Interactive Civic Issue Map

Reported issues are visualized geographically using an interactive map.

Different issue priorities and severities can be explored spatially, allowing users to understand **where civic problems are concentrated.**

---

### 📊 Civic Analytics

The analytics layer provides a consolidated view of:

- Issue categories
- Severity distribution
- Report statuses
- Priority levels
- Overall civic issue trends

---

### 📍 Location-Aware Reporting

Users can provide issue coordinates manually or use browser-based location detection when available.

This allows reports to be connected directly to their geographic location.

---

### 🔄 Issue Management Workflow

Reports can move through a structured workflow:

**Under Review → Assigned → Resolved**

This creates a simple lifecycle from citizen submission to resolution.

---

## 🧠 How CivicLens Works

```text
              CITIZEN REPORT
                    │
                    ▼
        ┌─────────────────────┐
        │  Report Collection  │
        └──────────┬──────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  AI-Assisted        │
        │  Issue Analysis     │
        └──────────┬──────────┘
                   │
          ┌────────┴─────────┐
          ▼                  ▼
   Severity & Category   Duplicate Check
          │                  │
          └────────┬─────────┘
                   ▼
        ┌─────────────────────┐
        │ Priority Scoring    │
        └──────────┬──────────┘
                   │
          ┌────────┴─────────┐
          ▼                  ▼
    Interactive Map       Analytics
          │                  │
          └────────┬─────────┘
                   ▼
        CIVIC RESPONSE & TRACKING
┌──────────────────────────────────┐
│          CivicLens UI            │
│      React + TypeScript + Vite   │
│                                  │
│     Deployed on Vercel           │
└────────────────┬─────────────────┘
                 │
                 │ REST API
                 ▼
┌──────────────────────────────────┐
│          FastAPI Backend          │
│                                  │
│  Reports • Analysis • Analytics  │
│             • Map                │
│                                  │
│     Deployed on Render           │
└────────────────┬─────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│       SQLAlchemy + SQLite        │
│        Civic Report Data         │
└──────────────────────────────────┘

**🛠️ Technology Stack**
Frontend
React
TypeScript
Vite
Tailwind CSS
Leaflet
Backend
Python
FastAPI
SQLAlchemy
Pydantic
Uvicorn
Data & Infrastructure
SQLite
REST API
Vercel
Render

**CORE API**
| Method  | Endpoint                    | Purpose                       |
| ------- | --------------------------- | ----------------------------- |
| `POST`  | `/api/reports`              | Create a civic report         |
| `GET`   | `/api/reports`              | Retrieve reports              |
| `GET`   | `/api/reports/{id}`         | Retrieve report details       |
| `POST`  | `/api/reports/{id}/analyze` | Analyze / re-analyze a report |
| `PATCH` | `/api/reports/{id}/status`  | Update report status          |
| `GET`   | `/api/analytics`            | Retrieve civic analytics      |
| `GET`   | `/api/map/issues`           | Retrieve map-ready issues     |


Interactive API Documentation

Explore and test the live API through Swagger:

https://civiclens-api-hzns.onrender.com/docs

🌐 Live Deployment
🚀 Live Application

https://civiclens-inky.vercel.app/

⚡ Backend API

https://civiclens-api-hzns.onrender.com

📚 API Documentation

https://civiclens-api-hzns.onrender.com/docs

**project structure**
CivicLens/
│
├── src/
│   ├── components/
│   ├── routes/
│   ├── lib/
│   └── types/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── main.py
│   │   └── config.py
│   │
│   ├── seed.py
│   └── requirements.txt
│
├── public/
├── package.json
└── README.md


💻 Run Locally
1. Clone the repository
git clone https://github.com/saniya6-11/_civicLens_.git
cd _civicLens_
2. Start the Backend

Open a terminal:

cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python seed.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Backend:

http://localhost:8000

API documentation:

http://localhost:8000/docs
3. Start the Frontend

Open a second terminal from the project root:

npm install
npm run dev

Frontend:

http://localhost:5173

The frontend uses:

VITE_API_URL=http://localhost:8000

for the local backend.

🎯 Use Cases

CivicLens can support reporting and monitoring of:

🕳️ Potholes and damaged roads
🗑️ Garbage accumulation
💡 Broken streetlights
💧 Water leaks
🏗️ Unsafe infrastructure
🚧 Road and public-space hazards
⚠️ Other locally reported civic issues
🔮 Future Scope

CivicLens can be extended with:

Computer vision for image-based issue detection
Real-time notifications for authorities
Ward-level dashboards
Heatmaps and historical trend analysis
Government department routing
Citizen verification and report validation
Mobile application support
Advanced geospatial risk analysis
Integration with municipal complaint systems

CivicLens was developed as a full-stack civic technology prototype demonstrating how AI-assisted analysis and geospatial intelligence can help transform raw citizen complaints into structured information for prioritization and monitoring.

The current prototype includes a live frontend, deployed FastAPI backend, interactive map, report workflow, AI-assisted analysis, duplicate detection, priority scoring, and analytics.

Turning civic complaints into actionable intelligence.

## 📸 Preview

CivicLens Dashboard
<img width="597" height="539" alt="Screenshot 2026-09-26 183728" src="https://github.com/user-attachments/assets/2a00f97e-0ac6-4287-958f-ebe2feb5981e" />
