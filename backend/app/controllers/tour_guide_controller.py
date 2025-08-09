from fastapi import APIRouter
router = APIRouter()

@router.get("/tour_guides")
def get_tour_guides():
    return [{"tour_id": 1, "guide_id": 1}]
