from fastapi import APIRouter, Header, HTTPException
from app.core.config import get_settings
from app.utils.ingest import ingest_from_supabase

router = APIRouter()


@router.post("/ingest")
async def trigger_ingest(x_ingest_secret: str = Header(..., alias="x-ingest-secret")):
    settings = get_settings()
    if x_ingest_secret != settings.ingest_secret:
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        count = await ingest_from_supabase()
        return {"status": "ok", "documents_ingested": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))