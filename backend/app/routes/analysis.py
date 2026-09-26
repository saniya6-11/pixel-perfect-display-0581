from fastapi import APIRouter
from ..services.ai_service import ai_service

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

@router.post("/image")
def analyze_image(payload: dict):
    """Image analysis adapter placeholder; fallback never claims to perform computer vision."""
    return ai_service.analyze_image(payload.get("image_url"))

