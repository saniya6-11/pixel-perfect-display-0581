from sqlalchemy.orm import Session
from . import models, schemas

def get_report(db: Session, report_id: int): return db.query(models.Report).filter(models.Report.id == report_id).first()
def list_reports(db: Session, category=None, severity=None, status=None, search=None, limit=50, offset=0):
    query = db.query(models.Report)
    if category: query = query.filter(models.Report.category == category.value)
    if severity: query = query.filter(models.Report.severity == severity.value)
    if status: query = query.filter(models.Report.status == status.value)
    if search: query = query.filter(models.Report.title.ilike(f"%{search}%") | models.Report.description.ilike(f"%{search}%") | models.Report.location_name.ilike(f"%{search}%"))
    return query.order_by(models.Report.created_at.desc()).offset(offset).limit(limit).all()
def create_report(db: Session, payload: schemas.ReportCreate):
    values = payload.model_dump(exclude={"category", "severity"})
    values.update(category=payload.category.value if payload.category else "OTHER", severity=payload.severity.value if payload.severity else "MEDIUM")
    report = models.Report(**values)
    db.add(report); db.commit(); db.refresh(report)
    return report

