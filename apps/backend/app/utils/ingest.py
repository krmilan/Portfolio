"""
Usage: .venv/bin/python -m app.utils.ingest
"""

import time
from google import genai
from app.core.config import get_settings
from app.core.database import get_supabase

settings = get_settings()
client = genai.Client(
    api_key=settings.gemini_api_key,
    http_options={"api_version": "v1"},
)

DOCUMENTS = [
    {
        "content": "Milan Ray is a 2023 MCA graduate and Full-Stack AI Engineer based in India. Specializes in AI Engineering, Full-Stack Development, Backend Systems, and Applied AI. Focus areas include RAG systems, LLM integration, FastAPI, Next.js, and scalable backend architecture. Targeting roles in AI Engineering, Full-Stack Engineering, Applied AI, and Startup Engineering.",
        "metadata": {"source": "about", "category": "profile"},
    },
    {
        "content": "Milan Ray technical skills. Frontend: Next.js 14, React, TypeScript, Tailwind CSS, Shadcn UI, Zustand, TanStack Query. Backend: FastAPI, Python, REST APIs, SSE, Pydantic. Databases: PostgreSQL, Supabase, pgvector. AI: Gemini API, Groq, RAG pipelines, embeddings. DevOps: Docker, GitHub Actions, CI/CD. Tools: Git, VSCode, pnpm, monorepo.",
        "metadata": {"source": "skills", "category": "technical"},
    },
    {
        "content": "Project AI Portfolio Platform: production-grade portfolio built with Next.js 14, FastAPI, Supabase pgvector, and Gemini. Features RAG-powered AI assistant, semantic search, animated mascot, SSE streaming. pnpm monorepo with apps/frontend and apps/backend. Free-tier infrastructure with GitHub Actions CI/CD.",
        "metadata": {"source": "projects", "category": "project"},
    },
    {
        "content": "RAG Architecture: Gemini gemini-embedding-001 generates 768-dimension embeddings stored in Supabase PostgreSQL with pgvector. Cosine similarity search via match_documents RPC retrieves top-k chunks. Retrieved context injected into Gemini prompt for grounded response generation. ivfflat indexing for fast ANN search.",
        "metadata": {"source": "architecture", "category": "technical"},
    },
    {
        "content": "Backend engineering: async FastAPI, Pydantic v2, pydantic-settings, dependency injection, CORS, SSE streaming, multi-stage Docker non-root builds.",
        "metadata": {"source": "architecture", "category": "backend"},
    },
    {
        "content": "Frontend engineering: Next.js 14 App Router, Server Components, TypeScript strict, Tailwind mobile-first, Shadcn UI, Zustand, TanStack Query, animated mascot sleeping idle blinking typing, typewriter hero, skill bars, gradient orbs, Syne DM Sans fonts.",
        "metadata": {"source": "architecture", "category": "frontend"},
    },
    {
        "content": "Milan Ray education: MCA graduate 2023, computer science fundamentals, self-driven AI ML practitioner, built production systems independently, targeting early-stage startups and AI-first product teams.",
        "metadata": {"source": "about", "category": "education"},
    },
]


def embed(text: str) -> list[float]:
    response = client.models.embed_content(
        model="models/gemini-embedding-001",
        contents=text,
    )
    return response.embeddings[0].values[:768]


def ingest():
    db = get_supabase()
    db.table("documents").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    print("Cleared existing documents.")
    print("Rate limit: 5 RPM — waiting 15s between each embed call.\n")

    for i, doc in enumerate(DOCUMENTS):
        print(f"[{i+1}/{len(DOCUMENTS)}] Embedding {doc['metadata']['category']}...")
        embedding = embed(doc["content"])
        db.table("documents").insert({
            "content": doc["content"],
            "embedding": embedding,
            "metadata": doc["metadata"],
        }).execute()
        print(f"  ✓ Done")
        if i < len(DOCUMENTS) - 1:
            time.sleep(15)

    print("\nAll documents ingested.")


if __name__ == "__main__":
    ingest()
