from fastapi import APIRouter
router = APIRouter()

@router.get("/categories")
def get_categories():
    return [{"category_id": 1, "category_name": "Adventure"}]
