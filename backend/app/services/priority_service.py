from datetime import datetime

SEVERITY_POINTS = {"LOW": 8, "MEDIUM": 16, "HIGH": 24, "CRITICAL": 30}
PUBLIC_IMPACT = {"ROAD_DAMAGE": 20, "GARBAGE": 13, "STREETLIGHT": 14, "WATER_LEAK": 19, "PUBLIC_SAFETY": 25, "OTHER": 10}

def calculate_priority(severity: str, category: str, duplicate_count: int, created_at: datetime, location_name: str = ""):
    factors = {
        "severity": SEVERITY_POINTS.get(severity, 16),
        "public_impact": PUBLIC_IMPACT.get(category, 10),
        "duplicate_reports": min(15, max(duplicate_count, 0) * 5),
        "age": min(20, max(0, (datetime.utcnow() - created_at).days)),
        "location_exposure": 10 if any(word in location_name.lower() for word in ("school", "hospital", "station", "college", "market")) else 5,
    }
    return min(100, sum(factors.values())), factors

