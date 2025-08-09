from fastapi import APIRouter
router = APIRouter()

@router.get("/tours")
def get_tours():
    return [{"tour_id": 1, "title": "Sample Tour"}]
