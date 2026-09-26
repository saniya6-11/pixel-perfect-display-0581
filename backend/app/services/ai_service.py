"""Provider boundary for civic issue analysis. The built-in analyzer is rules-based, not an AI model or computer vision system."""
import re

class FallbackAnalyzer:
    name = "deterministic_fallback"
    rules = {
        "ROAD_DAMAGE": (r"pothole|road|street|crack|pavement|damaged road", "HIGH", "Road surface damage reported; verify the affected area and traffic impact."),
        "GARBAGE": (r"garbage|waste|trash|rubbish|dump|litter", "MEDIUM", "Accumulated waste reported; arrange a sanitation inspection and cleanup."),
        "STREETLIGHT": (r"street ?light|lamp|lighting|dark road|light pole", "MEDIUM", "Street lighting issue reported; inspect the fixture and restore lighting."),
        "WATER_LEAK": (r"water leak|leaking pipe|burst pipe|water flowing|sewage", "HIGH", "Water leak reported; inspect the pipe and prevent further water loss."),
        "PUBLIC_SAFETY": (r"unsafe|accident|exposed wire|crime|danger|hazard|emergency", "HIGH", "Potential public safety concern reported; promptly assess the location."),
    }
    def analyze_text(self, title, description, category=None, severity=None):
        text = f"{title} {description}".lower()
        selected = next(((key, values) for key, values in self.rules.items() if re.search(values[0], text)), None)
        detected = selected[0] if selected else "OTHER"
        inferred_severity = selected[1][1] if selected else "LOW"
        summary = selected[1][2] if selected else "Civic issue reported; staff review is needed to identify the appropriate response."
        return {"category": category or detected, "severity": severity or inferred_severity, "confidence": 0.72 if selected else 0.4, "summary": summary, "recommended_action": summary, "provider": self.name}
    def analyze_image(self, image_url):
        return {"available": False, "provider": self.name, "message": "Image analysis is not available in the deterministic fallback. No visual inference was performed."}

class AIService:
    def __init__(self, provider=None): self.provider = provider or FallbackAnalyzer()
    def analyze_text(self, title, description, category=None, severity=None): return self.provider.analyze_text(title, description, category, severity)
    def analyze_image(self, image_url): return self.provider.analyze_image(image_url)

ai_service = AIService()
