from fastapi import APIRouter
from app.models.chat import HealthResponse
from app.core.config import get_settings
from app.core.database import get_supabase

router = APIRouter()


@router.api_route("/health", methods=["GET", "HEAD"], response_model=HealthResponse)
async def health_check():
    settings = get_settings()
    db_ok = False

    try:
        client = get_supabase()
        client.table("profile").select("id").limit(1).execute()
        db_ok = True
    except Exception as e:
        print(f"[DB PING FAILED] {e}")
        db_ok = False

    return HealthResponse(
        status="ok",
        version=settings.app_version,
        db_connected=db_ok,
    )
