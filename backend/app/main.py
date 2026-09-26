from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import FRONTEND_ORIGINS
from .database import Base, engine
from .routes import analysis, analytics, map, reports

Base.metadata.create_all(bind=engine)
app = FastAPI(title="CivicLens API", description="AI-powered civic issue intelligence API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=FRONTEND_ORIGINS, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(reports.router); app.include_router(analysis.router); app.include_router(analytics.router); app.include_router(map.router)

@app.get("/", tags=["health"])
def health(): return {"name": "CivicLens API", "status": "ok", "docs": "/docs"}

