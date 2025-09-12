from uuid import uuid4

from fastapi import APIRouter, Request
from pydantic import BaseModel, EmailStr, Field

from src.backend.services.write_form import write_form_to_json

router = APIRouter()


class Order(BaseModel):
    from_: str = Field(..., alias="from")
    to: str
    weight: float
    cargoType: str
    urgency: str
    distance: float
    phone: str
    email: EmailStr


@router.post("/")
async def write_form(order: Order):
    order_id = str(uuid4())[:8]
    order_data = order.model_dump(by_alias=True)
    order_data["id"] = order_id
    write_form_to_json(order_data)
    return {"id": order_id, "status": "ok"}

