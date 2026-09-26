from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Report

router = APIRouter(prefix="/api/map", tags=["map"])

@router.get("/issues")
def map_issues(db: Session = Depends(get_db)):
    reports = db.query(Report).filter(Report.latitude.is_not(None), Report.longitude.is_not(None)).all()
    return [{"id": r.id, "latitude": r.latitude, "longitude": r.longitude, "category": r.category, "severity": r.severity, "priority_score": r.priority_score, "status": r.status} for r in reports]

