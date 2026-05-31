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
        "content": "Milan Ray project: Ledgr.ai — a full-stack AI finance dashboard built in May 2026. Tech stack: Next.js 15, TypeScript, Express.js, PostgreSQL, Prisma ORM, OpenAI GPT-4o mini, Clerk auth, GitHub Actions, Vercel, Render, Supabase. Features: JWT authentication with Clerk, token verification in Express middleware, Clerk user IDs mapped to internal PostgreSQL UUIDs, OpenAI GPT-4o mini for automatic transaction categorization and monthly spending insights, DECIMAL(12,2) for money storage, composite indexes for dashboard queries, two-stage GitHub Actions pipeline with lint/typecheck/build gate on PRs and deploy hook to Render on merge. Fixed production bugs including Prisma/PgBouncer prepared-statement conflict and CORS failures on dynamic Vercel preview URLs. Live and on GitHub.",
        "metadata": {"source": "projects", "category": "project"},
    },
    {
        "content": "Milan Ray project: AI Portfolio Platform — this portfolio website itself, built in 2025-2026. Tech stack: Next.js 15, TypeScript, Tailwind CSS v4, FastAPI Python backend, Supabase PostgreSQL with pgvector, Gemini API for embeddings, Groq llama-3.1-8b-instant for chat responses, Docker, GitHub Actions CI/CD. Features: RAG-powered AI assistant with semantic search, 768-dimensional vector embeddings, animated mascot, terminal-style hero section, skill bars, project cards, admin panel with full CRUD, scroll-snapped sections. Deployed on Vercel (frontend) and Render (backend). Lighthouse scores: Performance 99, SEO 100. Infrastructure cost: $0.",
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