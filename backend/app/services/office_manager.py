"""
Module quản lý trạng thái văn phòng ảo và khởi tạo 4 nhân sự chủ chốt.
"""

from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models import AgentModel

# Tọa độ các phòng chính trong Virtual Pixel Office 2.5D Isometric (Đã căn chuẩn ghế ngồi, không trèo lên bàn)
ROOM_COORDINATES: Dict[str, Dict[str, int]] = {
    "director_office": {"x": 470, "y": 130},   # Ngồi trên ghế sofa da đỏ tiếp khách
    "architect_office": {"x": 125, "y": 195},  # Ngồi ghế xoay trước bàn thiết kế
    "boardroom": {"x": 445, "y": 350},         # Ghế họp phía trên bàn hội nghị
    "dev_lab": {"x": 135, "y": 410},           # Ngồi ghế trước máy tính Dev Lab
    "games_room": {"x": 710, "y": 405},        # Đứng cạnh bàn bida (không đứng trên bàn)
    "kitchen_pantry": {"x": 740, "y": 165},    # Đứng trước quầy cà phê pantry
    "qa_lab": {"x": 710, "y": 405},            # Trạm kiểm thử cạnh bida
    "lounge": {"x": 470, "y": 130},            # Ghế sofa thư giãn
}

# Dữ liệu khởi tạo cho 4 Dũng (Tọa độ ghế ngồi chuẩn xác, không chồng chéo vật dụng)
DEFAULT_AGENTS: List[Dict[str, Any]] = [
    {
        "code": "dung_1",
        "name": "Dũng 1",
        "role": "Software Director",
        "experience_years": 25,
        "specialty": "Định hướng chiến lược, phân tích bài toán nghiệp vụ, đề xuất giải pháp tối ưu và đàm phán giải pháp kỹ thuật cốt lõi.",
        "status": "idle",
        "current_room": "director_office",
        "pos_x": 470,
        "pos_y": 130,
        "target_x": 470,
        "target_y": 130,
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
        "pos_x": 125,
        "pos_y": 195,
        "target_x": 125,
        "target_y": 195,
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
        "pos_x": 135,
        "pos_y": 410,
        "target_x": 135,
        "target_y": 410,
        "avatar_color": "#10b981",  # Xanh lá Lập trình viên
    },
    {
        "code": "dung_4",
        "name": "Dũng 4",
        "role": "Test Engineer & Security Lead",
        "experience_years": 40,
        "specialty": "40 năm kinh nghiệm QA & Security: Thiết lập ma trận Test Cases, Boundary Values Analysis, Stress Test, bắt trọn mọi bug tiềm ẩn và lỗ hổng an ninh.",
        "status": "idle",
        "current_room": "games_room",
        "pos_x": 710,
        "pos_y": 405,
        "target_x": 710,
        "target_y": 405,
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
