from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from .. import crud, models, schemas
from ..database import get_db
from ..services.ai_service import ai_service
from ..services.duplicate_service import find_duplicates
from ..services.priority_service import calculate_priority

router = APIRouter(prefix="/api/reports", tags=["reports"])

def report_or_404(db, report_id):
    report = crud.get_report(db, report_id)
    if report is None: raise HTTPException(status_code=404, detail=f"Report {report_id} was not found")
    return report

@router.post("", response_model=schemas.ReportOut, status_code=201)
def create_report(payload: schemas.ReportCreate, db: Session = Depends(get_db)):
    report = crud.create_report(db, payload)
    analysis = ai_service.analyze_text(report.title, report.description, payload.category.value if payload.category else None, payload.severity.value if payload.severity else None)
    report.category, report.severity, report.ai_confidence, report.ai_summary = analysis["category"], analysis["severity"], analysis["confidence"], analysis["summary"]
    report.recommended_action, report.ai_processed = analysis["recommended_action"], 1
    db.commit(); db.refresh(report)
    score, _ = calculate_priority(report.severity, report.category, 0, report.created_at, report.location_name)
    report.priority_score = score; db.commit(); db.refresh(report)
    return report

@router.get("", response_model=list[schemas.ReportOut])
def get_reports(category: schemas.Category | None = None, severity: schemas.Severity | None = None, status: schemas.Status | None = None, search: str | None = Query(default=None, max_length=200), limit: int = Query(default=50, ge=1, le=200), offset: int = Query(default=0, ge=0), db: Session = Depends(get_db)):
    return crud.list_reports(db, category, severity, status, search, limit, offset)

@router.get("/{report_id}")
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = report_or_404(db, report_id)
    candidates = db.query(models.Report).all()
    duplicates = find_duplicates(report, candidates)
    score, factors = calculate_priority(report.severity, report.category, len(duplicates), report.created_at, report.location_name)
    report.priority_score = score; db.commit()
    return {"report": schemas.ReportOut.model_validate(report), "ai_analysis": {"confidence": report.ai_confidence, "summary": report.ai_summary, "recommended_action": report.recommended_action, "provider": "deterministic_fallback" if report.ai_processed else None}, "location": {"latitude": report.latitude, "longitude": report.longitude, "name": report.location_name}, "priority": {"priority_score": score, "factors": factors}, "potential_duplicates": duplicates, "duplicate_count": len(duplicates)}

@router.patch("/{report_id}/status", response_model=schemas.ReportOut)
def update_status(report_id: int, payload: schemas.StatusUpdate, db: Session = Depends(get_db)):
    report = report_or_404(db, report_id); report.status = payload.status.value; db.commit(); db.refresh(report); return report

@router.post("/{report_id}/analyze")
def analyze_report(report_id: int, db: Session = Depends(get_db)):
    report = report_or_404(db, report_id)
    analysis = ai_service.analyze_text(report.title, report.description)
    report.category, report.severity = analysis["category"], analysis["severity"]
    report.ai_confidence, report.ai_summary = analysis["confidence"], analysis["summary"]
    report.recommended_action, report.ai_processed = analysis["recommended_action"], 1
    duplicates = find_duplicates(report, db.query(models.Report).all())
    score, factors = calculate_priority(report.severity, report.category, len(duplicates), report.created_at, report.location_name)
    report.priority_score = score; db.commit(); db.refresh(report)
    return {**analysis, "priority_score": score, "priority_factors": factors, "potential_duplicates": duplicates, "duplicate_count": len(duplicates)}

