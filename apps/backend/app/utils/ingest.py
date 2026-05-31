"""
Usage: PYTHONPATH=. .venv/bin/python -m app.utils.ingest
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
    {"content": "Milan Ray is a 2023 MCA graduate and Full-Stack AI Engineer based in India. He specializes in AI Engineering, Full-Stack Development, Backend Systems, and Applied AI. His focus areas include RAG systems, LLM integration, FastAPI, Next.js, and scalable backend architecture. He is actively targeting roles in AI Engineering, Full-Stack Engineering, Applied AI, and Startup Engineering. Milan is open to work and available for immediate joining.", "metadata": {"source": "about", "category": "profile"}},
    {"content": "Milan Ray contact and links. GitHub: https://github.com/krmilan. Portfolio: https://krmilan-portfolio-frontend.vercel.app. Milan is open to work and can be contacted via email or LinkedIn for job opportunities, collaborations, or freelance projects.", "metadata": {"source": "about", "category": "contact"}},
    {"content": "Milan Ray education: completed MCA (Master of Computer Applications) in 2023. Strong computer science fundamentals including data structures, algorithms, operating systems, and databases. Self-driven AI and ML practitioner who built production systems independently. Built this entire AI portfolio platform from scratch as a solo engineer.", "metadata": {"source": "about", "category": "education"}},
    {"content": "Milan Ray frontend skills: Next.js 14 and 15 with App Router and Server Components, React with hooks and context, TypeScript with strict mode, Tailwind CSS v4 mobile-first design, Shadcn UI component library, Zustand for client state management, TanStack Query for server state and caching, responsive design, SEO optimization with metadata and Open Graph.", "metadata": {"source": "skills", "category": "frontend"}},
    {"content": "Milan Ray backend skills: FastAPI with async/await patterns, Python 3.12, Pydantic v2 for validation and settings, REST API design, Server-Sent Events SSE for streaming, dependency injection, centralized error handling, CORS configuration, multi-stage Docker builds with non-root users, pytest for testing.", "metadata": {"source": "skills", "category": "backend"}},
    {"content": "Milan Ray database and AI skills: PostgreSQL with Supabase, pgvector for vector similarity search, 768-dimensional embeddings, HNSW and IVFFlat indexing for approximate nearest neighbor search, cosine similarity, semantic search, RAG pipeline architecture, Gemini API for embeddings and generation, Groq with llama-3.1-8b-instant for fast inference.", "metadata": {"source": "skills", "category": "ai-database"}},
    {"content": "Milan Ray DevOps and tooling skills: Docker with multi-stage builds and slim images, GitHub Actions CI/CD pipelines, Vercel for frontend deployment with automatic preview deployments, Render for backend Docker deployment, UptimeRobot for monitoring, pnpm monorepo management, Git version control, environment variable management.", "metadata": {"source": "skills", "category": "devops"}},
    {"content": "Project: AI Portfolio Platform. A production-grade full-stack portfolio built entirely by Milan Ray. Tech stack: Next.js 15 frontend with TypeScript and Tailwind v4, FastAPI Python backend, Supabase PostgreSQL with pgvector for vector search, Gemini for embeddings, Groq llama-3.1-8b-instant for chat responses. Features include RAG-powered AI assistant, semantic document search, animated roaming mascot, terminal-style hero section, skill bars, project cards, admin panel with full CRUD, GitHub Actions CI/CD. Deployed on Vercel and Render. Lighthouse scores: Performance 99, SEO 100, Best Practices 96.", "metadata": {"source": "projects", "category": "project"}},
    {"content": "RAG system architecture: User question is embedded using Gemini gemini-embedding-001 model producing a 768-dimensional vector. pgvector performs cosine similarity search via match_documents Supabase RPC to retrieve top 5 most relevant document chunks with similarity threshold 0.3. Retrieved chunks are injected as context into a Groq prompt using llama-3.1-8b-instant. The model generates a grounded response based only on retrieved context preventing hallucination.", "metadata": {"source": "architecture", "category": "rag"}},
    {"content": "Infrastructure: Frontend on Vercel free tier with automatic deployments on every git push to master. Backend on Render free tier using Docker container. UptimeRobot pings health endpoint every 5 minutes to prevent cold starts. GitHub Actions runs lint, pytest, Docker build, then triggers Render deploy hook on backend changes. Total infrastructure cost: $0.", "metadata": {"source": "architecture", "category": "infrastructure"}},
    {"content": "Monorepo structure at github.com/krmilan/Portfolio: apps/frontend contains Next.js application, apps/backend contains FastAPI application. CI/CD uses path filters so frontend pushes deploy to Vercel automatically while backend pushes trigger GitHub Actions which validates and deploys to Render via deploy hook.", "metadata": {"source": "architecture", "category": "monorepo"}},
    {"content": "Milan Ray engineering philosophy: prioritizes simplicity over cleverness, ships working software over theoretical perfection, avoids premature optimization and unnecessary abstractions. Every dependency must justify its existence. Prefers fewer moving parts. Values production-quality code, maintainability, and real-world deployment over enterprise pattern inflation.", "metadata": {"source": "about", "category": "philosophy"}},
    {"content": "Why hire Milan Ray: fresh MCA graduate with production-level engineering skills, built a complete AI-powered platform from scratch including RAG pipeline, CI/CD, Docker deployment, and modern frontend. Demonstrates AI engineering maturity, full-stack capability, and DevOps literacy. Open to AI engineering, full-stack, backend, and applied AI roles at startups and AI-first product teams.", "metadata": {"source": "about", "category": "hiring"}},
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
    print(f"Ingesting {len(DOCUMENTS)} documents. Rate limit: 5 RPM — 13s between calls.\n")

    for i, doc in enumerate(DOCUMENTS):
        print(f"[{i+1}/{len(DOCUMENTS)}] Embedding: {doc['metadata']['category']}...")
        embedding = embed(doc["content"])
        db.table("documents").insert({
            "content": doc["content"],
            "embedding": embedding,
            "metadata": doc["metadata"],
        }).execute()
        print(f"  ✓ Inserted")
        if i < len(DOCUMENTS) - 1:
            time.sleep(13)

    print("\n✅ All documents ingested successfully.")


if __name__ == "__main__":
    ingest()
