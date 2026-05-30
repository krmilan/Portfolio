from fastapi import APIRouter
from app.models.chat import HealthResponse
from app.core.config import get_settings
from app.core.database import get_supabase

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    settings = get_settings()
    db_ok = False

    try:
        client = get_supabase()
        # lightweight ping — fetch 1 row from any system table
        client.table("_realtime_schema_migrations").select("id").limit(1).execute()
        db_ok = True
    except Exception:
        db_ok = False

    return HealthResponse(
        status="ok",
        version=settings.app_version,
        db_connected=db_ok,
    )