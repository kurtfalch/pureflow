from core.database import Base
from sqlalchemy import Column, DateTime, Integer, String


class Support_messages(Base):
    __tablename__ = "support_messages"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=True)