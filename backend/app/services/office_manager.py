"""
Module quản lý trạng thái văn phòng ảo và khởi tạo 4 nhân sự chủ chốt.
Phù hợp với bản đồ Cyberpunk High-Tech AI Virtual Office 16:9 (1376x768).
"""

from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models import AgentModel

# Tọa độ các phòng và trạm làm việc trong Cyberpunk Office 16:9 (1376x768)
ROOM_COORDINATES: Dict[str, Dict[str, int]] = {
    "director_office": {"x": 525, "y": 615},   # Bàn Giám Đốc / Executive Lounge (Dũng 1)
    "architect_office": {"x": 355, "y": 490},  # Trạm Kiến Trúc & PM (Dũng 2)
    "boardroom": {"x": 690, "y": 665},         # Bàn tròn trung tâm Hologram 3D
    "dev_lab": {"x": 245, "y": 590},           # Trạm Cyber Dev Lab (Dũng 3)
    "games_room": {"x": 455, "y": 410},        # Trạm QA & Test (Dũng 4)
    "kitchen_pantry": {"x": 470, "y": 700},    # Sảnh Cafe & Xe Bay
    "qa_lab": {"x": 455, "y": 410},
    "lounge": {"x": 470, "y": 700},
}

# Ghế ngồi chỉ định riêng biệt cho từng Dũng quanh Bàn tròn Hologram 3D
BOARDROOM_SEATS: Dict[str, Dict[str, int]] = {
    "dung_1": {"x": 525, "y": 615},  # Ghế trên bên trái bàn tròn
    "dung_2": {"x": 555, "y": 720},  # Ghế dưới bên trái bàn tròn
    "dung_3": {"x": 635, "y": 750},  # Ghế dưới trung tâm bàn tròn
    "dung_4": {"x": 740, "y": 750},  # Ghế dưới bên phải bàn tròn
}

# Dữ liệu khởi tạo cho 4 Dũng tại các trạm chuyên môn
DEFAULT_AGENTS: List[Dict[str, Any]] = [
    {
        "code": "dung_1",
        "name": "Dũng 1",
        "role": "Software Director",
        "experience_years": 25,
        "specialty": "Định hướng chiến lược, phân tích bài toán nghiệp vụ, đề xuất giải pháp tối ưu và đàm phán giải pháp kỹ thuật cốt lõi.",
        "status": "idle",
        "current_room": "director_office",
        "pos_x": 525,
        "pos_y": 615,
        "target_x": 525,
        "target_y": 615,
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
        "pos_x": 355,
        "pos_y": 490,
        "target_x": 355,
        "target_y": 490,
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
        "pos_x": 245,
        "pos_y": 590,
        "target_x": 245,
        "target_y": 590,
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
        "pos_x": 455,
        "pos_y": 410,
        "target_x": 455,
        "target_y": 410,
        "avatar_color": "#ef4444",  # Đỏ Kiểm thử & An ninh
    },
]


def init_default_agents(db: Session) -> None:
    """
    Kiểm tra và khởi tạo 4 Agent vào cơ sở dữ liệu nếu chưa tồn tại.
    Đồng thời đưa các Agent về đúng trạm làm việc chuyên môn.
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
    Tự động phân bổ ghế quanh bàn tròn Hologram khi vào boardroom.
    """
    agent = db.query(AgentModel).filter(AgentModel.code == agent_code).first()
    if agent and room_name in ROOM_COORDINATES:
        if room_name == "boardroom" and agent_code in BOARDROOM_SEATS:
            coords = BOARDROOM_SEATS[agent_code]
        else:
            coords = ROOM_COORDINATES[room_name]
        agent.target_x = coords["x"]
        agent.target_y = coords["y"]
        agent.current_room = room_name
        agent.status = status
        db.commit()
        db.refresh(agent)
    return agent
