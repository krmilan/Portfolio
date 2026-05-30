from pydantic import BaseModel
from typing import Optional


class Project(BaseModel):
    id: str
    title: str
    description: str
    tech_stack: list[str]
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    embedding_id: Optional[str] = None