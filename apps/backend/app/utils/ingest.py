"""
Usage: PYTHONPATH=. .venv/bin/python -m app.utils.ingest
"""

import time
import asyncio
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
        "content": "Milan Ray is a full-stack developer based in Bengaluru, Karnataka, India. He completed his MCA from Lovely Professional University in 2023 with a CGPA of 8.01, and his BCA from Reva University in 2021 with a CGPA of 8.41. He is looking for roles in Software Development, SDE, AI, and Full-Stack engineering. He is open to work and available for immediate joining.",
        "metadata": {"source": "about", "category": "profile"},
    },
    {
        "content": "Milan Ray contact details: email milanofficial09@gmail.com, phone +91 76023 42828, LinkedIn linkedin.com/in/milanray, GitHub github.com/krmilan, location Bengaluru Karnataka India.",
        "metadata": {"source": "about", "category": "contact"},
    },
    {
        "content": "Milan Ray technical skills. Languages: TypeScript, JavaScript, Python, Java. Frontend: Next.js 15, React, Tailwind CSS, Recharts. Backend: Node.js, Express.js, REST APIs, JWT Auth, FastAPI. Databases: PostgreSQL, Prisma ORM, MongoDB, MySQL, Supabase, PgBouncer, pgvector. AI and Cloud: OpenAI API, Gemini API, Groq, Clerk, Vercel, Render. DevOps: GitHub Actions CI/CD, Git, Docker, Postman.",
        "metadata": {"source": "skills", "category": "technical"},
    },
    {
        "content": "Milan Ray project: Ledgr.ai — a production-grade AI-powered personal finance dashboard. Milan built it from scratch over 90 days starting from only basic HTML/CSS/JS knowledge, demonstrating full-stack TypeScript development, RESTful API design, relational database modeling, JWT authentication, and AI integration. Live app: https://ledgr-ai-frontend.vercel.app. Backend API: https://ledgr-ai-backend.onrender.com/health. Source code: https://github.com/krmilan/ledgr-ai. Tech stack — Frontend: Next.js 15 with App Router, TypeScript, Tailwind CSS, Clerk for auth, Recharts for charts, Lucide React. Backend: Node.js, Express, TypeScript, Prisma 5.22.0 ORM, PostgreSQL on Supabase, PgBouncer connection pooling on port 6543, Clerk Backend SDK for JWT verification, OpenAI SDK with GPT-4o mini, express-rate-limit. Infrastructure: Vercel (frontend), Render free tier (backend), Supabase (database), GitHub Actions (CI/CD).",
        "metadata": {"source": "projects", "category": "project", "project": "ledgr-ai"},
    },
    {
        "content": "Ledgr.ai authentication and database design. Auth flow: user signs in via Clerk on the frontend, Clerk issues a signed JWT, the frontend attaches it as Authorization: Bearer <token>, the Express backend middleware calls Clerk's verifyToken() to validate it, the Clerk ID is extracted from the JWT payload, and a resolveDbUserId() helper maps the Clerk ID to an internal PostgreSQL UUID for all database queries. This design means auth providers can be swapped without touching relational data. Database schema has four tables: users (id UUID, clerk_id, email, created_at), transactions (id UUID, user_id FK, name, amount DECIMAL(12,2), category, date, ai_categorized boolean), budgets (id UUID, user_id FK, category, limit_amount, month, year), ai_insights (id UUID, user_id FK, insight_text, month, year, generated_at). Key design decisions: UUIDs as primary keys to prevent sequential enumeration attacks, DECIMAL(12,2) for money to avoid floating-point rounding errors, composite indexes on (user_id, date) and (user_id, category) for common dashboard query patterns, cascade deletes, unique constraint on (user_id, category, month, year) in budgets.",
        "metadata": {"source": "projects", "category": "project", "project": "ledgr-ai"},
    },
    {
        "content": "Ledgr.ai API endpoints and features. API routes — Users: POST /api/users/sync (sync Clerk user on first login), GET /api/users/me. Transactions: GET /api/transactions (paginated with filters), GET /api/transactions/summary (income, expenses, category breakdown), POST /api/transactions (create with optional AI categorization), PATCH /api/transactions/:id, DELETE /api/transactions/:id. Budgets: GET /api/budgets (with actual spend merged in), POST /api/budgets (upsert), PATCH /api/budgets/:id, DELETE /api/budgets/:id. AI: GET /api/ai/insights (retrieve saved monthly insight), POST /api/ai/insights (generate new insight via OpenAI), POST /api/ai/categorize (auto-categorize a transaction by name). Health: GET /health, GET /api/health/detailed. Demo: POST /api/demo/seed (seeds 32 transactions and 8 budgets with safety check), DELETE /api/demo/clear. Features: dashboard with monthly snapshot and Recharts spending chart, full CRUD transactions with debounced search, category filtering and pagination, monthly budget progress bars with over-budget alerts, GPT-4o mini monthly spending analysis with actionable tips, AI auto-categorization on transaction creation, one-click demo seed with safety check, responsive mobile-first layout.",
        "metadata": {"source": "projects", "category": "project", "project": "ledgr-ai"},
    },
    {
        "content": "Ledgr.ai key engineering decisions. Why monorepo: keeps frontend and backend in one repo with shared versioning, atomic commits across both layers, single CI/CD pipeline. Why Prisma over raw SQL: type-safe queries catch bugs at compile time, schema-as-code means migrations are version-controlled and reproducible. Why PgBouncer: PostgreSQL has a hard connection limit; PgBouncer on port 6543 multiplexes application connections into fewer real database connections, essential at scale and required on Render free tier. Why Clerk instead of custom auth: implementing secure auth correctly takes weeks and is a common vulnerability source; Clerk handles password hashing, session management, OAuth, and MFA — the backend only calls verifyToken(). Why UUIDs instead of Clerk IDs as primary keys: Clerk's user_2abc... ID format is not a UUID and is not suitable as a PostgreSQL foreign key. Why DECIMAL(12,2) for money: floating-point types cannot represent most decimal values exactly causing rounding errors in financial calculations. Why Vercel Git integration instead of CLI: the CLI caused environment variables not to be injected correctly on the production URL.",
        "metadata": {"source": "projects", "category": "project", "project": "ledgr-ai"},
    },
    {
        "content": "Ledgr.ai production bugs fixed and CI/CD pipeline. Bugs fixed: (1) PgBouncer prepared statement conflict — added ?pgbouncer=true to DATABASE_URL to disable named prepared statements. (2) Timezone date filtering off by one day — switched to Date.UTC() everywhere for consistent UTC-based date filtering. (3) Clerk ID vs PostgreSQL UUID mismatch — built resolveDbUserId() helper to look up internal UUID from Clerk ID on every authenticated request. (4) Prisma namespace types crashing on Render — replaced Prisma.TransactionGetPayload namespace types with plain TypeScript object types. (5) prisma generate missing from Render build — added npx prisma generate to the Render build command. (6) CORS blocking Vercel preview URLs — switched to regex pattern matching (/vercel.app$/) instead of exact string. (7) Rate limiter X-Forwarded-For warning — added app.set('trust proxy', 1) in app.ts. (8) Vercel internal server error on production — removed CLI deploy from GitHub Actions and used native Git integration instead. CI/CD pipeline: ci.yml runs on every push (Node 18 backend: prisma generate + tsc + build; Node 20 frontend: tsc + build). deploy.yml runs on push to main: CI gate first, then Render deploy hook for backend, Vercel Git integration handles frontend automatically. Migrations run manually because Supabase free tier blocks port 5432 from GitHub Actions IPs and PgBouncer transaction mode does not support DDL.",
        "metadata": {"source": "projects", "category": "project", "project": "ledgr-ai"},
    },
    {
        "content": "Milan Ray project: AI Portfolio Platform — this portfolio website itself, built in 2025-2026. Tech stack: Next.js 15, TypeScript, Tailwind CSS v4, FastAPI Python backend, Supabase PostgreSQL with pgvector, Gemini API for embeddings, Groq llama-3.1-8b-instant for chat responses, Docker, GitHub Actions CI/CD. Features: RAG-powered AI assistant with semantic search, 768-dimensional vector embeddings, terminal-style hero section, skill bars, project cards, admin panel with full CRUD, scroll-snapped sections. Deployed on Vercel (frontend) and Render (backend). Lighthouse scores: Performance 99, SEO 100. Infrastructure cost: $0.",
        "metadata": {"source": "projects", "category": "project"},
    },
    {
        "content": "Milan Ray project: Blockchain E-Voting System — built January to April 2023. Tech stack: Solidity, Ethereum, React, Node.js, MetaMask, Truffle. Built a voting application using Ethereum smart contracts in Solidity with a React frontend and MetaMask wallet authentication. Votes recorded on-chain rather than in a central database. Published a research paper on the architecture at ICCS 2023 and SSRN.",
        "metadata": {"source": "projects", "category": "project"},
    },
    {
        "content": "Milan Ray work experience: Web Development Intern at Zidio Development, June 2024 to September 2024, remote. Built a Resume Builder and Job Listing Portal using the MERN stack — React, Node.js, Express.js, MongoDB — with cloud storage for user-uploaded files. Worked in an agile team and contributed across both frontend and backend.",
        "metadata": {"source": "experience", "category": "experience"},
    },
    {
        "content": "Milan Ray education: MCA from Lovely Professional University, Phagwara Punjab, August 2021 to August 2023, CGPA 8.01. BCA from Reva University, Bengaluru Karnataka, June 2018 to June 2021, CGPA 8.41.",
        "metadata": {"source": "about", "category": "education"},
    },
    {
        "content": "Milan Ray certifications and achievements: Published research paper 'Electronic Voting System Powered by Blockchain Technology' at ICCS 2023 and SSRN. Won 1st Runner-Up at Hackathon at Reva University in May 2021. Completed courses: The Complete 2024 Web Development Bootcamp on Udemy, DSA on CipherSchools, Python Bible on Udemy.",
        "metadata": {"source": "about", "category": "achievements"},
    },
    {
        "content": "Milan Ray RAG and AI system in portfolio: User question is embedded using Gemini gemini-embedding-001 producing a 768-dimensional vector. pgvector performs cosine similarity search via match_documents Supabase RPC to retrieve relevant document chunks. Retrieved chunks are injected as context into Groq llama-3.1-8b-instant. The model answers only based on retrieved context to prevent hallucination. This is Milan's first production RAG implementation.",
        "metadata": {"source": "architecture", "category": "rag"},
    },
    {
        "content": "Milan Ray infrastructure and DevOps: Frontend deployed on Vercel free tier with automatic deployments on every git push to master. Backend on Render free tier using Docker container. UptimeRobot pings health endpoint every 5 minutes to prevent Render cold starts. GitHub Actions CI/CD pipeline runs lint, pytest, Docker build validation, then triggers Render deploy hook on backend changes. Total infrastructure cost: $0.",
        "metadata": {"source": "architecture", "category": "infrastructure"},
    },
    {
        "content": "Why hire Milan Ray: He is an early-career full-stack developer who has built and shipped real production projects independently. He has hands-on experience with modern web stacks including Next.js, FastAPI, PostgreSQL, and AI APIs. He learns fast, solves real problems, and has demonstrated ability to deploy and maintain full-stack applications end-to-end. Open to SDE, full-stack, backend, and AI-adjacent roles.",
        "metadata": {"source": "about", "category": "hiring"},
    },
]


def embed(text: str) -> list[float]:
    response = client.models.embed_content(
        model="models/gemini-embedding-001",
        contents=text,
    )
    return response.embeddings[0].values[:768]


def embed_batch(texts: list[str]) -> list[list[float]]:
    response = client.models.embed_content(
        model="models/gemini-embedding-001",
        contents=texts,
    )
    return [e.values[:768] for e in response.embeddings]


def ingest():
    """Local CLI ingest using static DOCUMENTS list."""
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


async def ingest_from_supabase() -> int:
    """Auto-ingest from live Supabase tables. Called by admin Sync RAG button."""
    db = get_supabase()

    # Fetch live data
    profile = db.table("profile").select("*").eq("id", 1).single().execute().data or {}
    projects = db.table("projects").select("*").eq("visible", True).order("display_order").execute().data or []
    skills = db.table("skills").select("*").order("display_order").execute().data or []
    experiences = db.table("experience").select("*").order("display_order").execute().data or []
    certs = db.table("certifications").select("*").order("display_order").execute().data or []

    docs = []

    # Profile chunk
    if profile:
        roles = ", ".join(profile.get("roles") or [])
        docs.append({
            "content": f"Milan Ray is a full-stack AI engineer based in Bengaluru, India. Roles: {roles}. Bio: {profile.get('bio', '')}. Open to work: {profile.get('open_to_work', True)}. GitHub: {profile.get('github_url', '')}. LinkedIn: {profile.get('linkedin_url', '')}. Email: {profile.get('email', '')}.",
            "metadata": {"source": "profile", "category": "profile"},
        })

    # Skills chunk
    if skills:
        skill_text = " | ".join([
            f"{s['category']}: {', '.join([i['name'] if isinstance(i, dict) else i for i in (s.get('items') or [])])}"
            for s in skills
        ])
        docs.append({
            "content": f"Milan Ray technical skills: {skill_text}",
            "metadata": {"source": "skills", "category": "technical"},
        })

    # Project chunks
    for p in projects:
        tags = ", ".join(p.get("tags") or [])
        links = []
        if p.get("github_url"): links.append(f"GitHub: {p['github_url']}")
        if p.get("live_url"): links.append(f"Live: {p['live_url']}")
        docs.append({
            "content": f"Milan Ray project: {p['title']}. {p.get('description', '')} Tech stack: {tags}. {' '.join(links)}",
            "metadata": {"source": "projects", "category": "project", "project": p["title"]},
        })

    # Experience chunks
    for e in experiences:
        points = " ".join(e.get("points") or [])
        tags = ", ".join(e.get("tags") or [])
        docs.append({
            "content": f"Milan Ray {e.get('type', 'work')} experience: {e.get('role', '')} at {e.get('org', '')}, {e.get('location', '')}, {e.get('period', '')}. {points} Technologies: {tags}.",
            "metadata": {"source": "experience", "category": "experience"},
        })

    # Certs chunk
    if certs:
        cert_text = " | ".join([f"{c['name']} from {c['issuer']} ({c.get('date', '')})" for c in certs])
        docs.append({
            "content": f"Milan Ray certifications and achievements: {cert_text}",
            "metadata": {"source": "about", "category": "achievements"},
        })

    # Static docs with no Supabase table (RAG arch, infra, hiring, contact, education)
    static_docs = [
        d for d in DOCUMENTS
        if d["metadata"].get("source") in {"architecture", "about"}
        and d["metadata"].get("category") in {"rag", "infrastructure", "hiring", "contact", "education"}
    ]
    # Detailed Ledgr.ai engineering chunks
    ledgr_docs = [d for d in DOCUMENTS if d["metadata"].get("project") == "ledgr-ai"]
    docs.extend(static_docs)
    docs.extend(ledgr_docs)

    # Clear existing
    db.table("documents").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()

    # Batch embed (5 per batch = safe within Gemini 5 RPM)
    batch_size = 5
    all_embeddings = []
    for i in range(0, len(docs), batch_size):
        batch = docs[i:i + batch_size]
        embeddings = embed_batch([d["content"] for d in batch])
        all_embeddings.extend(embeddings)
        if i + batch_size < len(docs):
            await asyncio.sleep(13)

    # Insert all
    for doc, embedding in zip(docs, all_embeddings):
        db.table("documents").insert({
            "content": doc["content"],
            "embedding": embedding,
            "metadata": doc["metadata"],
        }).execute()

    return len(docs)


if __name__ == "__main__":
    ingest()
