from fastapi import APIRouter
router = APIRouter()

@router.get("/discounts")
def get_discounts():
    return [{"discount_id": 1, "code": "SALE10"}]
