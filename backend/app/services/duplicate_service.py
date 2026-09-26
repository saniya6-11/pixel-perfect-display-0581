from math import asin, cos, radians, sin, sqrt
from difflib import SequenceMatcher

def distance_m(lat1, lon1, lat2, lon2):
    dlat, dlon = radians(lat2-lat1), radians(lon2-lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1))*cos(radians(lat2))*sin(dlon/2)**2
    return 6371000 * 2 * asin(sqrt(a))

def find_duplicates(report, candidates, radius_m=500, similarity_threshold=0.35):
    matches = []
    for other in candidates:
        if other.id == report.id or other.category != report.category:
            continue
        distance = distance_m(report.latitude, report.longitude, other.latitude, other.longitude)
        similarity = SequenceMatcher(None, report.description.lower(), other.description.lower()).ratio()
        if distance <= radius_m and similarity >= similarity_threshold:
            matches.append({"id": other.id, "title": other.title, "category": other.category, "severity": other.severity, "status": other.status, "distance_m": round(distance), "similarity": round(similarity, 2)})
    return matches

