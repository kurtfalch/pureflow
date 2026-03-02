import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.support_messages import Support_messages

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class Support_messagesService:
    """Service layer for Support_messages operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Support_messages]:
        """Create a new support_messages"""
        try:
            obj = Support_messages(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created support_messages with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating support_messages: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Support_messages]:
        """Get support_messages by ID"""
        try:
            query = select(Support_messages).where(Support_messages.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching support_messages {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of support_messagess"""
        try:
            query = select(Support_messages)
            count_query = select(func.count(Support_messages.id))
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Support_messages, field):
                        query = query.where(getattr(Support_messages, field) == value)
                        count_query = count_query.where(getattr(Support_messages, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Support_messages, field_name):
                        query = query.order_by(getattr(Support_messages, field_name).desc())
                else:
                    if hasattr(Support_messages, sort):
                        query = query.order_by(getattr(Support_messages, sort))
            else:
                query = query.order_by(Support_messages.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching support_messages list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Support_messages]:
        """Update support_messages"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Support_messages {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated support_messages {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating support_messages {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete support_messages"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Support_messages {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted support_messages {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting support_messages {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Support_messages]:
        """Get support_messages by any field"""
        try:
            if not hasattr(Support_messages, field_name):
                raise ValueError(f"Field {field_name} does not exist on Support_messages")
            result = await self.db.execute(
                select(Support_messages).where(getattr(Support_messages, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching support_messages by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Support_messages]:
        """Get list of support_messagess filtered by field"""
        try:
            if not hasattr(Support_messages, field_name):
                raise ValueError(f"Field {field_name} does not exist on Support_messages")
            result = await self.db.execute(
                select(Support_messages)
                .where(getattr(Support_messages, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Support_messages.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching support_messagess by {field_name}: {str(e)}")
            raise