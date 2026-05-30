from supabase import create_client, Client
from app.core.config import get_settings
from functools import lru_cache


@lru_cache
def get_supabase() -> Client:
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def ping_db() -> bool:
    try:
        client = get_supabase()
        client.table("documents").select("id").limit(1).execute()
        return True
    except Exception:
        return False