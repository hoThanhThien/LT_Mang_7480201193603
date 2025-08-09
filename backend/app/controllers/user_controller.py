from fastapi import APIRouter
router = APIRouter()

@router.get("/users")
def get_users():
    return [{"user_id": 1, "full_name": "Test User"}]
