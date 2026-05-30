from fastapi import APIRouter, Depends, HTTPException
from app.models.chat import ChatRequest, ChatResponse
from app.services.rag import RAGService

router = APIRouter()


def get_rag_service() -> RAGService:
    return RAGService()


@router.post("/chat", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    rag: RAGService = Depends(get_rag_service),
):
    try:
        reply, sources = await rag.answer(payload.message, payload.history)
        return ChatResponse(reply=reply, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))