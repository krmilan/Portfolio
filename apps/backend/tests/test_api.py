from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_chat_validation():
    """Chat endpoint rejects empty messages."""
    response = client.post("/api/v1/chat", json={"message": ""})
    assert response.status_code == 422