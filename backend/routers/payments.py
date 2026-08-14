from fastapi import APIRouter, Depends
from dependencies import get_current_user

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/mock-charge")
def mock_charge(amount: float, current_user=Depends(get_current_user)):
    # Mock payment gateway: return a fake transaction id and status
    return {"status": "succeeded", "amount": amount, "transaction_id": "txn_mock_12345"}
