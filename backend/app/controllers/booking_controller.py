from fastapi import APIRouter
router = APIRouter()

@router.get("/bookings")
def get_bookings():
    return [{"booking_id": 1, "status": "Pending"}]
