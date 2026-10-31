"""
Kiểm thử tự động cho hệ thống Backend FastAPI và Workflow Bộ Ba Chuyên Gia (3 Dũng).
Tuân thủ chuẩn REST API OpenAPI, Cổng phê duyệt người dùng (Human-in-the-loop)
và nghiệm thu hai chiều.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    """Kiểm tra endpoint /api/health và trạng thái hệ thống"""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "agents_count" in data
    assert data["agents_count"] == 3


def test_get_agents():
    """Kiểm tra danh sách Bộ Ba Chuyên Gia (3 Dũng) đã được nạp đầy đủ"""
    response = client.get("/api/agents")
    assert response.status_code == 200
    agents = response.json()
    assert len(agents) == 3
    agent_names = [a["name"] for a in agents]
    assert "Dũng 1" in agent_names
    assert "Dũng 2" in agent_names
    assert "Dũng 3" in agent_names


def test_full_workflow():
    """Kiểm tra tạo bài toán, tranh luận Giai đoạn 1, duyệt từng ý và nghiệm thu"""
    # 1. Tạo session mới
    create_resp = client.post("/api/sessions", json={
        "title": "Kiểm thử hệ thống QR F&B",
        "user_problem": "Phân tích rủi ro khi triển khai QR Code order menu và kiến trúc chống gian lận"
    })
    assert create_resp.status_code == 201
    session_id = create_resp.json()["id"]

    # 2. Kích hoạt tranh luận hội đồng (Dũng 1 & Dũng 2)
    trigger_resp = client.post("/api/workflow/trigger", json={
        "session_id": session_id,
        "step": "full_cycle"
    })
    assert trigger_resp.status_code == 200
    messages = trigger_resp.json()
    assert len(messages) == 2

    # Kiểm tra Dũng 1 và Dũng 2 tranh luận nảy lửa
    stages = [m["stage"] for m in messages]
    assert "1_operation_strategy_debate" in stages
    assert "1_software_architecture_debate" in stages

    # 3. Lấy Bảng Thống Nhất chuẩn 5 tiêu chí để người dùng duyệt từng ý
    matrix_resp = client.get(f"/api/workflow/consensus-features/{session_id}")
    assert matrix_resp.status_code == 200
    features = matrix_resp.json()
    assert len(features) > 0
    assert "requirement" in features[0]
    assert "system_compliance_percent" in features[0]

    # 4. Người dùng duyệt chọn ý tưởng cần phát triển
    selected_ids = [features[0]["id"]]
    select_resp = client.post("/api/workflow/select-features", json={
        "session_id": session_id,
        "selected_feature_ids": selected_ids
    })
    assert select_resp.status_code == 200

    # 5. Dũng 3 thực thi mã nguồn & nghiệm thu 2 chiều tại Boardroom
    exec_resp = client.post("/api/workflow/execute-workstations", json={
        "session_id": session_id
    })
    assert exec_resp.status_code == 200
    exec_messages = exec_resp.json()
    assert len(exec_messages) >= 2
