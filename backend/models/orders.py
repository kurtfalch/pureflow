from core.database import Base
from sqlalchemy import Column, DateTime, Float, Integer, String


class Orders(Base):
    __tablename__ = "orders"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    items = Column(String, nullable=True)
    total_amount = Column(Float, nullable=False)
    status = Column(String, nullable=False)
    stripe_session_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True)