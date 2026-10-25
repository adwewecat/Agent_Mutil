"""
Kiểm thử tự động cho hệ thống Backend FastAPI và Workflow 4 Dũng.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    """Kiểm tra endpoint /api/health"""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "agents_count" in data
    assert data["agents_count"] == 4


def test_get_agents():
    """Kiểm tra danh sách 4 Dũng đã được nạp đầy đủ"""
    response = client.get("/api/agents")
    assert response.status_code == 200
    agents = response.json()
    assert len(agents) == 4
    agent_names = [a["name"] for a in agents]
    assert "Dũng 1" in agent_names
    assert "Dũng 2" in agent_names
    assert "Dũng 3" in agent_names
    assert "Dũng 4" in agent_names


def test_full_workflow():
    """Kiểm tra tạo bài toán và kích hoạt chu trình 4 Dũng"""
    # 1. Tạo session mới
    create_resp = client.post("/api/sessions", json={
        "title": "Kiểm thử hệ thống",
        "user_problem": "Xây dựng hệ thống quản lý giao dịch chịu tải 50,000 TPS"
    })
    assert create_resp.status_code == 201
    session_id = create_resp.json()["id"]

    # 2. Kích hoạt full cycle
    trigger_resp = client.post("/api/workflow/trigger", json={
        "session_id": session_id,
        "step": "full_cycle"
    })
    assert trigger_resp.status_code == 200
    messages = trigger_resp.json()
    assert len(messages) == 4

    # Kiểm tra 4 Dũng đều lên tiếng
    stages = [m["stage"] for m in messages]
    assert "1_director" in stages
    assert "2_architect" in stages
    assert "3_developer" in stages
    assert "4_qa" in stages
