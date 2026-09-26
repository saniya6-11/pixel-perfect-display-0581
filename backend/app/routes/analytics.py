from collections import Counter
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Report

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("")
def get_analytics(db: Session = Depends(get_db)):
    reports = db.query(Report).all(); total = len(reports)
    resolved = [r for r in reports if r.status == "RESOLVED"]
    resolution_days = [(r.updated_at-r.created_at).total_seconds()/86400 for r in resolved]
    by_month = {}
    for report in reports:
        month = report.created_at.strftime("%Y-%m")
        entry = by_month.setdefault(month, {"month": month, "count": 0, "resolved": 0})
        entry["count"] += 1
        if report.status == "RESOLVED":
            entry["resolved"] += 1
    return {"total_reports": total, "critical_reports": sum(r.severity == "CRITICAL" for r in reports), "resolved_reports": len(resolved), "ai_processed_reports": sum(bool(r.ai_processed) for r in reports), "reports_by_category": dict(Counter(r.category for r in reports)), "reports_by_severity": dict(Counter(r.severity for r in reports)), "reports_by_status": dict(Counter(r.status for r in reports)), "reports_over_time": [by_month[month] for month in sorted(by_month)], "resolution_rate": round(len(resolved)/total, 4) if total else 0, "average_resolution_time": round(sum(resolution_days)/len(resolution_days), 2) if resolution_days else 0}
