from datetime import datetime
from sqlalchemy import Column, DateTime, Float, Integer, String, Text
from .database import Base

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(30), nullable=False, default="OTHER", index=True)
    severity = Column(String(20), nullable=False, default="MEDIUM", index=True)
    priority_score = Column(Integer, nullable=False, default=0)
    status = Column(String(20), nullable=False, default="NEW", index=True)
    image_url = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_name = Column(String(200), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    ai_confidence = Column(Float, nullable=True)
    ai_summary = Column(Text, nullable=True)
    recommended_action = Column(Text, nullable=True)
    ai_processed = Column(Integer, nullable=False, default=0)
