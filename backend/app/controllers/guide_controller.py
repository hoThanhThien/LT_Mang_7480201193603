from fastapi import APIRouter
router = APIRouter()

@router.get("/guides")
def get_guides():
    return [{"guide_id": 1, "name": "John Doe"}]
