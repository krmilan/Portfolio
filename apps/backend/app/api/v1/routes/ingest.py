from fastapi import APIRouter, Header, HTTPException, BackgroundTasks
from app.core.config import get_settings
from app.utils.ingest import ingest_from_supabase

router = APIRouter()


@router.post("/ingest")
async def trigger_ingest(
    background_tasks: BackgroundTasks,
    x_ingest_secret: str = Header(..., alias="x-ingest-secret"),
):
    if x_ingest_secret != get_settings().ingest_secret:
        raise HTTPException(status_code=401, detail="Unauthorized")
    background_tasks.add_task(ingest_from_supabase)
    return {"status": "accepted", "message": "Ingest started in background — check Render logs for completion"}