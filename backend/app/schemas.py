from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class Category(str, Enum):
    ROAD_DAMAGE="ROAD_DAMAGE"; GARBAGE="GARBAGE"; STREETLIGHT="STREETLIGHT"; WATER_LEAK="WATER_LEAK"; PUBLIC_SAFETY="PUBLIC_SAFETY"; OTHER="OTHER"
class Severity(str, Enum):
    LOW="LOW"; MEDIUM="MEDIUM"; HIGH="HIGH"; CRITICAL="CRITICAL"
class Status(str, Enum):
    NEW="NEW"; UNDER_REVIEW="UNDER_REVIEW"; ASSIGNED="ASSIGNED"; IN_PROGRESS="IN_PROGRESS"; RESOLVED="RESOLVED"

class ReportCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=3, max_length=5000)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    location_name: str = Field(min_length=1, max_length=200)
    category: Optional[Category] = None
    severity: Optional[Severity] = None
    image_url: Optional[str] = Field(default=None, max_length=8_500_000)

class StatusUpdate(BaseModel):
    status: Status

class ReportOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int; title: str; description: str; category: Category; severity: Severity
    priority_score: int; status: Status; image_url: Optional[str]; latitude: float; longitude: float
    location_name: str; created_at: datetime; updated_at: datetime
    ai_confidence: Optional[float]; ai_summary: Optional[str]; recommended_action: Optional[str]
