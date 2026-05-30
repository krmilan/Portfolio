from fastapi import APIRouter
from app.api.v1.routes import health, chat

router = APIRouter(prefix="/api/v1")
router.include_router(health.router, tags=["system"])
router.include_router(chat.router, tags=["ai"])
