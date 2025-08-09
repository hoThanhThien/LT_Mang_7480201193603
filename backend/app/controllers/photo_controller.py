from fastapi import APIRouter
router = APIRouter()

@router.get("/photos")
def get_photos():
    return [{"photo_id": 1, "image_url": "url.jpg"}]
