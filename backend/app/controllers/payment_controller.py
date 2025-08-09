from fastapi import APIRouter
router = APIRouter()

@router.get("/payments")
def get_payments():
    return [{"payment_id": 1, "amount": 100.0}]
