import time
from google import genai
from groq import Groq
from app.core.config import get_settings
from app.core.database import get_supabase
from app.models.chat import ChatMessage


class RAGService:
    def __init__(self):
        self.settings = get_settings()
        self.gemini = genai.Client(
            api_key=self.settings.gemini_api_key,
            http_options={"api_version": "v1"},
        )
        self.groq = Groq(api_key=self.settings.groq_api_key)

    def _embed(self, text: str) -> list[float]:
        response = self.gemini.models.embed_content(
            model="models/gemini-embedding-001",
            contents=text,
        )
        return response.embeddings[0].values[:768]

    def _retrieve(self, query_embedding: list[float]) -> list[dict]:
        client = get_supabase()
        response = client.rpc(
            "match_documents",
            {
                "query_embedding": query_embedding,
                "match_threshold": self.settings.vector_match_threshold,
                "match_count": self.settings.vector_match_count,
            },
        ).execute()
        return response.data or []

    def _build_messages(
        self,
        message: str,
        context_chunks: list[dict],
        history: list[ChatMessage],
    ) -> list[dict]:
        context = "\n\n".join(c["content"] for c in context_chunks)

        if context:
            system = f"""You are Milan Ray's AI portfolio assistant. Your ONLY job is to answer questions about Milan based on the context below.

STRICT RULES:
- Answer ONLY using the context provided. Do not use any outside knowledge.
- If the context does not contain enough information to answer, say: "I don't have that information in my portfolio data."
- Never invent skills, experience, or projects not mentioned in the context.
- Be conversational, honest, and concise. Milan is an early-career developer, not a senior engineer.
- Do not exaggerate or oversell. Represent Milan accurately.

CONTEXT:
{context}"""
        else:
            system = """You are Milan Ray's AI portfolio assistant. You were unable to retrieve relevant portfolio data for this question.
Respond with: "I don't have enough information about that in my portfolio. Try asking about Milan's skills, projects, or tech stack."
Do not answer from general knowledge."""

        messages = [{"role": "system", "content": system}]
        for msg in history[-6:]:
            messages.append({"role": msg.role, "content": msg.content})
        messages.append({"role": "user", "content": message})
        return messages

    async def answer(
        self,
        message: str,
        history: list[ChatMessage],
    ) -> tuple[str, list[str]]:
        embedding = self._embed(message)
        time.sleep(2)  # respect Gemini embed rate limit
        chunks = self._retrieve(embedding)
        messages = self._build_messages(message, chunks, history)

        response = self.groq.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            max_tokens=512,
            temperature=0.3,
        )
        reply = response.choices[0].message.content
        sources = [c["metadata"].get("source", "") for c in chunks if c.get("metadata")]
        return reply, [s for s in sources if s]