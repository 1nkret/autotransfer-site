from fastapi import APIRouter

from src.backend.core.config import AUTOPARK

router = APIRouter()


@router.get("/")
async def get_bids():
    return AUTOPARK
