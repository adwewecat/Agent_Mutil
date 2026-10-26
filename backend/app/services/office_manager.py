"""
Module quản lý trạng thái văn phòng ảo và khởi tạo 4 nhân sự chủ chốt.
"""

from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models import AgentModel

# Tọa độ các phòng chính trong Tháp Công Nghệ AI 4 Tầng (Pin 1083256516649506882)
ROOM_COORDINATES: Dict[str, Dict[str, int]] = {
    "director_office": {"x": 395, "y": 385},   # Tầng 4: Penthouse Giám Đốc (Dũng 1)
    "architect_office": {"x": 395, "y": 555},  # Tầng 3: Bàn Tròn Kiến Trúc & PM (Dũng 2)
    "boardroom": {"x": 395, "y": 555},         # Hội đồng chiến lược đa tầng
    "dev_lab": {"x": 380, "y": 750},           # Tầng 2: Cyber Dev Workshop (Dũng 3)
    "games_room": {"x": 395, "y": 940},        # Tầng 1: QA Cyber Defense (Dũng 4)
    "kitchen_pantry": {"x": 440, "y": 940},    # Sảnh kính tiếp đón tầng trệt
    "qa_lab": {"x": 395, "y": 940},
    "lounge": {"x": 440, "y": 940},
}

# Dữ liệu khởi tạo cho 4 Dũng (Tọa độ trên 4 tầng Tháp AI)
DEFAULT_AGENTS: List[Dict[str, Any]] = [
    {
        "code": "dung_1",
        "name": "Dũng 1",
        "role": "Software Director",
        "experience_years": 25,
        "specialty": "Định hướng chiến lược, phân tích bài toán nghiệp vụ, đề xuất giải pháp tối ưu và đàm phán giải pháp kỹ thuật cốt lõi.",
        "status": "idle",
        "current_room": "director_office",
        "pos_x": 395,
        "pos_y": 385,
        "target_x": 395,
        "target_y": 385,
        "avatar_color": "#3b82f6",  # Xanh dương Giám đốc
    },
    {
        "code": "dung_2",
        "name": "Dũng 2",
        "role": "Software Architect & Project Manager",
        "experience_years": 40,
        "specialty": "40 năm kinh nghiệm kiến trúc hệ thống & quản lý dự án: Thẩm định khả thi, tối ưu tài nguyên, chi phí, rủi ro, phản biện sâu sắc, đánh giá độ trễ và tải hệ thống.",
        "status": "idle",
        "current_room": "architect_office",
        "pos_x": 395,
        "pos_y": 555,
        "target_x": 395,
        "target_y": 555,
        "avatar_color": "#8b5cf6",  # Tím Kiến trúc sư
    },
    {
        "code": "dung_3",
        "name": "Dũng 3",
        "role": "Senior Fullstack Developer",
        "experience_years": 40,
        "specialty": "40 năm kinh nghiệm lập trình Fullstack: Hiện thực hóa mã nguồn chuẩn xác, tối ưu thuật toán, xây dựng API sạch, loại bỏ triệt để code dư thừa.",
        "status": "coding",
        "current_room": "dev_lab",
        "pos_x": 380,
        "pos_y": 750,
        "target_x": 380,
        "target_y": 750,
        "avatar_color": "#10b981",  # Xanh lá Lập trình viên
    },
    {
        "code": "dung_4",
        "name": "Dũng 4",
        "role": "Test Engineer & Security Lead",
        "experience_years": 40,
        "specialty": "40 năm kinh nghiệm QA & Security: Thiết lập ma trận Test Cases, Boundary Values Analysis, Stress Test, bắt trọn mọi bug tiềm ẩn và lỗ hổng an ninh.",
        "status": "testing",
        "current_room": "games_room",
        "pos_x": 395,
        "pos_y": 940,
        "target_x": 395,
        "target_y": 940,
        "avatar_color": "#ef4444",  # Đỏ Kiểm thử & An ninh
    },
]




def init_default_agents(db: Session) -> None:
    """
    Kiểm tra và khởi tạo 4 Agent vào cơ sở dữ liệu nếu chưa tồn tại.
    Đồng thời đưa các Agent về đúng bàn làm việc chuyên môn thay vì ở lại pantry.
    """
    for agent_data in DEFAULT_AGENTS:
        existing = db.query(AgentModel).filter(AgentModel.code == agent_data["code"]).first()
        if not existing:
            agent = AgentModel(**agent_data)
            db.add(agent)
        else:
            existing.current_room = agent_data["current_room"]
            existing.pos_x = agent_data["pos_x"]
            existing.pos_y = agent_data["pos_y"]
            existing.target_x = agent_data["target_x"]
            existing.target_y = agent_data["target_y"]
            existing.status = agent_data["status"]
    db.commit()


def move_agent_to_room(db: Session, agent_code: str, room_name: str, status: str = "moving") -> AgentModel:
    """
    Cập nhật tọa độ mục tiêu để Agent di chuyển trên bản đồ Canvas.
    """
    agent = db.query(AgentModel).filter(AgentModel.code == agent_code).first()
    if agent and room_name in ROOM_COORDINATES:
        coords = ROOM_COORDINATES[room_name]
        agent.target_x = coords["x"]
        agent.target_y = coords["y"]
        agent.current_room = room_name
        agent.status = status
        db.commit()
        db.refresh(agent)
    return agent
