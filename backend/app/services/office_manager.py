"""
Module quản lý trạng thái văn phòng ảo và khởi tạo 4 nhân sự chủ chốt.
"""

from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models import AgentModel

# Tọa độ các phòng chính trong Virtual Pixel Office
ROOM_COORDINATES: Dict[str, Dict[str, int]] = {
    "director_office": {"x": 120, "y": 140},   # Phòng Giám đốc (Dũng 1)
    "architect_office": {"x": 280, "y": 140},  # Phòng Kiến trúc sư (Dũng 2)
    "boardroom": {"x": 440, "y": 160},         # Phòng họp chiến lược (Hội đồng Dũng 1 & Dũng 2)
    "dev_lab": {"x": 600, "y": 140},           # Phòng Lập trình phát triển (Dũng 3)
    "qa_lab": {"x": 760, "y": 140},            # Phòng Kiểm thử & An ninh mạng (Dũng 4)
    "lounge": {"x": 440, "y": 320},            # Khu vực Cà phê & Thư giãn nghỉ ngơi
}

# Dữ liệu khởi tạo cho 4 Dũng
DEFAULT_AGENTS: List[Dict[str, Any]] = [
    {
        "code": "dung_1",
        "name": "Dũng 1",
        "role": "Software Director",
        "experience_years": 25,
        "specialty": "Định hướng chiến lược, phân tích bài toán nghiệp vụ, đề xuất giải pháp tối ưu và đàm phán giải pháp kỹ thuật cốt lõi.",
        "status": "idle",
        "current_room": "director_office",
        "pos_x": 120,
        "pos_y": 140,
        "target_x": 120,
        "target_y": 140,
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
        "pos_x": 280,
        "pos_y": 140,
        "target_x": 280,
        "target_y": 140,
        "avatar_color": "#8b5cf6",  # Tím Kiến trúc sư
    },
    {
        "code": "dung_3",
        "name": "Dũng 3",
        "role": "Senior Fullstack Developer",
        "experience_years": 40,
        "specialty": "40 năm kinh nghiệm lập trình Fullstack: Hiện thực hóa mã nguồn chuẩn xác, tối ưu thuật toán, xây dựng API sạch, loại bỏ triệt để code dư thừa.",
        "status": "idle",
        "current_room": "dev_lab",
        "pos_x": 600,
        "pos_y": 140,
        "target_x": 600,
        "target_y": 140,
        "avatar_color": "#10b981",  # Xanh lá Lập trình viên
    },
    {
        "code": "dung_4",
        "name": "Dũng 4",
        "role": "Test Engineer & Security Lead",
        "experience_years": 40,
        "specialty": "40 năm kinh nghiệm QA & Security: Thiết lập ma trận Test Cases, Boundary Values Analysis, Stress Test, bắt trọn mọi bug tiềm ẩn và lỗ hổng an ninh.",
        "status": "idle",
        "current_room": "qa_lab",
        "pos_x": 760,
        "pos_y": 140,
        "target_x": 760,
        "target_y": 140,
        "avatar_color": "#ef4444",  # Đỏ Kiểm thử & An ninh
    },
]


def init_default_agents(db: Session) -> None:
    """
    Kiểm tra và khởi tạo 4 Agent vào cơ sở dữ liệu nếu chưa tồn tại.
    """
    for agent_data in DEFAULT_AGENTS:
        existing = db.query(AgentModel).filter(AgentModel.code == agent_data["code"]).first()
        if not existing:
            agent = AgentModel(**agent_data)
            db.add(agent)
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
