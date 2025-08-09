from fastapi import APIRouter
router = APIRouter()

@router.get("/tourschedules")
def get_tourschedules():
    return [{"schedule_id": 1, "day_number": 1}]
