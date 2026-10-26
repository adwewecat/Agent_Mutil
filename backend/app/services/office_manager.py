"""
Module quản lý trạng thái văn phòng ảo và khởi tạo 4 nhân sự chủ chốt.
"""

from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models import AgentModel

# Tọa độ các phòng chính trong Virtual Pixel Office 4D Isometric chuẩn Pin 412290540892514371
ROOM_COORDINATES: Dict[str, Dict[str, int]] = {
    "director_office": {"x": 135, "y": 132},   # Ngồi lún sâu vào đệm sofa da, tay cầm tách cà phê
    "architect_office": {"x": 413, "y": 168},  # Ngồi ghế xoay trước bàn CAD & bản vẽ blueprint
    "boardroom": {"x": 740, "y": 342},         # Khu vực thảo luận chiến lược (ghế họp sau bàn)
    "dev_lab": {"x": 388, "y": 372},           # Ngồi ghế xoay trước bàn máy tính 2 màn hình, gõ phím cơ RGB
    "games_room": {"x": 714, "y": 168},        # Ngồi ghế xoay trạm QA kiểm thử, mèo ngủ bên cạnh
    "kitchen_pantry": {"x": 160, "y": 375},    # Đứng quầy bar pha cà phê giải lao
    "qa_lab": {"x": 714, "y": 168},            # Trạm kiểm thử QA cubicle
    "lounge": {"x": 135, "y": 132},            # Sofa tiếp khách làm việc
}

# Dữ liệu khởi tạo cho 4 Dũng (Tọa độ ghế ngồi chuẩn xác tại bàn làm việc)
DEFAULT_AGENTS: List[Dict[str, Any]] = [
    {
        "code": "dung_1",
        "name": "Dũng 1",
        "role": "Software Director",
        "experience_years": 25,
        "specialty": "Định hướng chiến lược, phân tích bài toán nghiệp vụ, đề xuất giải pháp tối ưu và đàm phán giải pháp kỹ thuật cốt lõi.",
        "status": "idle",
        "current_room": "director_office",
        "pos_x": 135,
        "pos_y": 132,
        "target_x": 135,
        "target_y": 132,
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
        "pos_x": 413,
        "pos_y": 168,
        "target_x": 413,
        "target_y": 168,
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
        "pos_x": 388,
        "pos_y": 372,
        "target_x": 388,
        "target_y": 372,
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
        "pos_x": 714,
        "pos_y": 168,
        "target_x": 714,
        "target_y": 168,
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
            if existing.current_room == "kitchen_pantry":
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
