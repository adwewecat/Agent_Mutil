"""
Module quản lý trạng thái văn phòng ảo và khởi tạo 4 nhân sự chủ chốt.
Phù hợp với bản đồ Cyberpunk High-Tech AI Virtual Office 16:9 (1376x768).
"""

from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models import AgentModel

# Tọa độ các phòng và trạm làm việc trong Cyberpunk Office 16:9 (1376x768)
ROOM_COORDINATES: Dict[str, Dict[str, int]] = {
    "director_office": {"x": 750, "y": 470},   # Bàn Giám Đốc / Executive Seat (Dũng 1)
    "architect_office": {"x": 410, "y": 460},  # Trạm Kiến Trúc & PM (Dũng 2 - Nữ)
    "boardroom": {"x": 820, "y": 560},         # Bàn tròn trung tâm Hologram 3D
    "dev_lab": {"x": 215, "y": 565},           # Trạm Cyber Dev Lab (Dũng 3 - Nam)
    "games_room": {"x": 610, "y": 340},        # Trạm QA & Test (Dũng 4 - Nữ)
    "kitchen_pantry": {"x": 1050, "y": 620},   # Sảnh Cafe & Ngắm Xe Bay
    "qa_lab": {"x": 610, "y": 340},
    "lounge": {"x": 1050, "y": 620},
}

# Ghế ngồi chỉ định riêng biệt cho từng Dũng quanh Bàn tròn Hologram 3D (Tất cả quay mặt vào Hologram)
BOARDROOM_SEATS: Dict[str, Dict[str, int]] = {
    "dung_1": {"x": 750, "y": 470},  # Top-Left bàn tròn (Dũng 1 - Nam)
    "dung_2": {"x": 600, "y": 550},  # Left bàn tròn (Dũng 2 - Nữ)
    "dung_3": {"x": 680, "y": 760},  # Bottom-Left bàn tròn (Dũng 3 - Nam)
    "dung_4": {"x": 880, "y": 770},  # Bottom-Center bàn tròn (Dũng 4 - Nữ)
}

# Dữ liệu khởi tạo cho 4 Dũng tại các trạm chuyên môn (2 Nam, 2 Nữ Anime chuyên nghiệp)
DEFAULT_AGENTS: List[Dict[str, Any]] = [
    {
        "code": "dung_1",
        "name": "Dũng 1",
        "role": "Software Director",
        "experience_years": 25,
        "specialty": "Định hướng chiến lược, phân tích bài toán nghiệp vụ, đề xuất giải pháp tối ưu và đàm phán giải pháp kỹ thuật cốt lõi.",
        "status": "idle",
        "current_room": "director_office",
        "pos_x": 750,
        "pos_y": 470,
        "target_x": 750,
        "target_y": 470,
        "avatar_color": "#3b82f6",  # Xanh dương Giám đốc (Nam)
    },
    {
        "code": "dung_2",
        "name": "Dũng 2",
        "role": "Software Architect & Project Manager",
        "experience_years": 40,
        "specialty": "40 năm kinh nghiệm kiến trúc hệ thống & quản lý dự án: Thẩm định khả thi, tối ưu tài nguyên, chi phí, rủi ro, phản biện sâu sắc, đánh giá độ trễ và tải hệ thống.",
        "status": "idle",
        "current_room": "architect_office",
        "pos_x": 410,
        "pos_y": 460,
        "target_x": 410,
        "target_y": 460,
        "avatar_color": "#ec4899",  # Hồng tím Kiến trúc sư (Nữ)
    },
    {
        "code": "dung_3",
        "name": "Dũng 3",
        "role": "Senior Fullstack Developer",
        "experience_years": 40,
        "specialty": "40 năm kinh nghiệm lập trình Fullstack: Hiện thực hóa mã nguồn chuẩn xác, tối ưu thuật toán, xây dựng API sạch, loại bỏ triệt để code dư thừa.",
        "status": "coding",
        "current_room": "dev_lab",
        "pos_x": 215,
        "pos_y": 565,
        "target_x": 215,
        "target_y": 565,
        "avatar_color": "#10b981",  # Xanh lá Lập trình viên (Nam)
    },
    {
        "code": "dung_4",
        "name": "Dũng 4",
        "role": "Test Engineer & Security Lead",
        "experience_years": 40,
        "specialty": "40 năm kinh nghiệm QA & Security: Thiết lập ma trận Test Cases, Boundary Values Analysis, Stress Test, bắt trọn mọi bug tiềm ẩn và lỗ hổng an ninh.",
        "status": "testing",
        "current_room": "games_room",
        "pos_x": 610,
        "pos_y": 340,
        "target_x": 610,
        "target_y": 340,
        "avatar_color": "#f43f5e",  # Hồng đỏ Kiểm thử & An ninh (Nữ)
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
