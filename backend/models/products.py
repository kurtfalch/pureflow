from core.database import Base
from sqlalchemy import Column, Float, Integer, String


class Products(Base):
    __tablename__ = "products"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    short_description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    image_url = Column(String, nullable=True)
    image_url_2 = Column(String, nullable=True)
    image_url_3 = Column(String, nullable=True)
    features = Column(String, nullable=True)
    category = Column(String, nullable=True)