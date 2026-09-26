from datetime import datetime, timedelta
from app.database import Base, SessionLocal, engine
from app.models import Report
from app.services.priority_service import calculate_priority

Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    if db.query(Report).count() == 0:
        rows = [
            ("Large pothole at college gate", "Deep pothole near the college entrance causing traffic and two-wheeler risk.", "ROAD_DAMAGE", "HIGH", "NEW", 12.93450, 77.61010, "Bangalore College Road", 1),
            ("Road crater beside campus", "Large pothole in the road by college entrance, cars swerve around it.", "ROAD_DAMAGE", "HIGH", "UNDER_REVIEW", 12.93480, 77.61030, "Bangalore College Road", 3),
            ("Overflowing bins in market", "Garbage and litter overflowing near the market entrance.", "GARBAGE", "MEDIUM", "ASSIGNED", 12.97160, 77.59460, "Bangalore Central Market", 2),
            ("Water leaking on 5th Cross", "A pipe is leaking water continuously onto the street.", "WATER_LEAK", "HIGH", "IN_PROGRESS", 12.93510, 77.61000, "Bangalore 5th Cross", 5),
            ("Streetlight out near bus stop", "The lamp post is not working and the bus stop is dark at night.", "STREETLIGHT", "MEDIUM", "NEW", 12.93600, 77.61100, "Bangalore Bus Stop", 4),
            ("Exposed wire by school", "An exposed electrical wire hangs near the school walkway; immediate hazard.", "PUBLIC_SAFETY", "CRITICAL", "UNDER_REVIEW", 12.92790, 77.62710, "Bangalore School Road", 1),
            ("Illegal dumping by park", "Construction waste dumped beside the public park.", "GARBAGE", "HIGH", "NEW", 12.92700, 77.62600, "Bangalore Park", 7),
            ("Broken pavement near hospital", "Cracked pavement makes wheelchair access difficult outside hospital.", "ROAD_DAMAGE", "HIGH", "ASSIGNED", 12.95600, 77.64100, "Bangalore Hospital Road", 10),
            ("Leaking main at bus depot", "Water flowing from a broken pipe at the depot entrance.", "WATER_LEAK", "CRITICAL", "IN_PROGRESS", 12.95700, 77.64200, "Bangalore Bus Depot", 2),
            ("Dark pedestrian crossing", "Street lighting has failed at the pedestrian crossing.", "STREETLIGHT", "HIGH", "RESOLVED", 12.95800, 77.64300, "Bangalore Crossing", 14),
            ("Damaged road after rain", "Several road cracks and potholes have appeared after heavy rain.", "ROAD_DAMAGE", "MEDIUM", "NEW", 12.96100, 77.58000, "Bangalore West", 3),
            ("Waste blocking drain", "Garbage pile is blocking the stormwater drain near the apartments.", "GARBAGE", "HIGH", "IN_PROGRESS", 12.96200, 77.58100, "Bangalore West Apartments", 6),
            ("Unsafe abandoned structure", "Loose sheets on an abandoned structure may fall onto pedestrians.", "PUBLIC_SAFETY", "HIGH", "UNDER_REVIEW", 12.96300, 77.58200, "Bangalore West Main Road", 9),
            ("Low water pressure", "Residents report a municipal water supply disruption since morning.", "OTHER", "MEDIUM", "RESOLVED", 12.96600, 77.60000, "Bangalore East", 21),
            ("Traffic signal malfunction", "Traffic signal is stuck and causing confusion at the intersection.", "PUBLIC_SAFETY", "CRITICAL", "ASSIGNED", 12.96700, 77.60100, "Bangalore East Junction", 2),
            ("Pothole near railway station", "A deep road pothole is causing vehicles to brake suddenly.", "ROAD_DAMAGE", "HIGH", "NEW", 12.97700, 77.57000, "Bangalore Railway Station", 4),
            ("Streetlight flickering", "Street lamp flickers and goes dark along the station approach.", "STREETLIGHT", "LOW", "RESOLVED", 12.97730, 77.57020, "Bangalore Railway Station", 30),
        ]
        now = datetime.utcnow()
        for title, desc, category, severity, status, lat, lon, loc, age in rows:
            created = now - timedelta(days=age)
            score, _ = calculate_priority(severity, category, 0, created, loc)
            db.add(Report(title=title, description=desc, category=category, severity=severity, status=status, latitude=lat, longitude=lon, location_name=loc, priority_score=score, created_at=created, updated_at=created + timedelta(days=1), ai_confidence=0.72, ai_summary="Demonstration analysis; review required by city staff.", recommended_action="Verify the report on site and route it to the responsible municipal team.", ai_processed=1))
        db.commit()
        print(f"Seeded {len(rows)} CivicLens demonstration reports.")
    else:
        print("Database already contains reports; seed skipped.")
finally:
    db.close()

