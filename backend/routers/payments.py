import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
import stripe

from core.database import get_db
from core.config import settings
from dependencies.auth import get_current_user
from schemas.auth import UserResponse
from models.orders import Orders

stripe.api_key = settings.stripe_secret_key

router = APIRouter(prefix="/api/v1/payment", tags=["payment"])

logger = logging.getLogger(__name__)


class CartItemRequest(BaseModel):
    product_id: int
    product_name: str
    package_type: str
    package_label: str
    quantity: int
    unit_price: float


class CheckoutRequest(BaseModel):
    items: List[CartItemRequest]
    total_amount: float


class CheckoutResponse(BaseModel):
    session_id: str
    url: str


class PaymentVerificationRequest(BaseModel):
    session_id: str


class PaymentStatusResponse(BaseModel):
    status: str
    order_id: Optional[int] = None
    payment_status: Optional[str] = None


@router.post("/create_payment_session", response_model=CheckoutResponse)
async def create_payment_session(
    data: CheckoutRequest,
    request: Request,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a Stripe checkout session from cart items"""
    try:
        frontend_host = request.headers.get("App-Host")
        if frontend_host and not frontend_host.startswith(("http://", "https://")):
            frontend_host = f"https://{frontend_host}"

        # Create order in database
        import json
        items_json = json.dumps([item.dict() for item in data.items])

        order = Orders(
            user_id=current_user.id,
            items=items_json,
            total_amount=data.total_amount,
            status="pending",
            created_at=datetime.now(),
        )
        db.add(order)
        await db.flush()

        # Build Stripe line items
        line_items = []
        for item in data.items:
            line_items.append({
                "price_data": {
                    "currency": "nok",
                    "product_data": {
                        "name": f"{item.product_name} – {item.package_label}",
                    },
                    "unit_amount": int(item.unit_price * 100),
                },
                "quantity": item.quantity,
            })

        # Create Stripe checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=f"{frontend_host}/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{frontend_host}/checkout",
            metadata={
                "order_id": str(order.id),
                "user_id": current_user.id,
            },
        )

        # Save session ID to order
        order.stripe_session_id = session.id
        await db.commit()

        return CheckoutResponse(session_id=session.id, url=session.url)

    except Exception as e:
        logger.error(f"Payment session creation error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create payment session: {str(e)}")


@router.post("/verify_payment", response_model=PaymentStatusResponse)
async def verify_payment(
    data: PaymentVerificationRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Verify payment status and update order"""
    try:
        session = stripe.checkout.Session.retrieve(data.session_id)
        order_id = session.metadata.get("order_id")

        status_mapping = {
            "complete": "paid",
            "open": "pending",
            "expired": "cancelled",
        }
        status = status_mapping.get(session.status, "pending")

        # Update order status
        if order_id:
            from sqlalchemy import select
            result = await db.execute(
                select(Orders).where(Orders.id == int(order_id))
            )
            order = result.scalar_one_or_none()
            if order:
                order.status = status
                await db.commit()

        return PaymentStatusResponse(
            status=status,
            order_id=int(order_id) if order_id else None,
            payment_status=session.payment_status,
        )

    except Exception as e:
        logger.error(f"Payment verification error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to verify payment: {str(e)}")