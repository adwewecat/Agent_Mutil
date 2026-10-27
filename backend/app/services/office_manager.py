"""
Module quản lý trạng thái văn phòng ảo và khởi tạo 3 nhân sự chủ chốt.
Phù hợp với bản đồ Cyberpunk High-Tech AI Virtual Office 16:9 (1376x768).
Bộ Ba Chuyên Gia:
1. Dũng 1: Giám đốc Vận hành & Chiến lược Phát triển Toàn diện (40 năm KN F&B & Fastfood)
2. Dũng 2: Giám đốc Phần mềm & Kiến trúc Hệ thống (40 năm KN Công nghệ & Phần mềm)
3. Dũng 3: Senior Fullstack Developer (30 năm KN) - Chỉ thực thi khi Người dùng duyệt
"""

from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models import AgentModel

# Tọa độ các phòng và trạm làm việc trong Cyberpunk AI Office 16:9 (1376x768)
ROOM_COORDINATES: Dict[str, Dict[str, int]] = {
    "director_office": {"x": 230, "y": 260},   # Bàn Giám Đốc Vận Hành F&B (Dũng 1)
    "architect_office": {"x": 385, "y": 620},  # Trạm Giám Đốc Phần Mềm (Dũng 2)
    "boardroom": {"x": 1000, "y": 340},        # Bàn tròn trung tâm Hologram 3D
    "dev_lab": {"x": 185, "y": 620},           # Trạm Cyber Dev Lab (Dũng 3)
    "kitchen_pantry": {"x": 980, "y": 650},    # Sảnh Cafe & Ngắm Xe Bay
    "lounge": {"x": 980, "y": 650},
}

# Ghế ngồi chỉ định riêng biệt cho 3 Dũng quanh Bàn tròn Hologram 3D (Thế tam giác cân đối xứng)
BOARDROOM_SEATS: Dict[str, Dict[str, int]] = {
    "dung_1": {"x": 1000, "y": 275},  # Ghế Bắc: Giám đốc Vận hành F&B (Dũng 1)
    "dung_2": {"x": 860, "y": 375},   # Ghế Tây Nam: Giám đốc Phần mềm (Dũng 2)
    "dung_3": {"x": 1140, "y": 375},  # Ghế Đông Nam: Senior Fullstack Dev 30 năm KN (Dũng 3)
}

# Dữ liệu khởi tạo cho 3 Dũng theo đúng yêu cầu
DEFAULT_AGENTS: List[Dict[str, Any]] = [
    {
        "code": "dung_1",
        "name": "Dũng 1",
        "role": "Giám đốc Vận hành & Chiến lược F&B",
        "experience_years": 40,
        "specialty": "40 năm kinh nghiệm F&B & Fastfood: Phân tích sâu thị trường, đề xuất quy trình chuẩn, đối chiếu case studies đối thủ (McDonald's, Starbucks, Domino's, Haidilao... xem họ làm thế nào, gặp khó khăn gì, cái hay của họ là gì).",
        "status": "idle",
        "current_room": "director_office",
        "pos_x": 230,
        "pos_y": 260,
        "target_x": 230,
        "target_y": 260,
        "avatar_color": "#3b82f6",  # Xanh dương Giám đốc Vận hành
    },
    {
        "code": "dung_2",
        "name": "Dũng 2",
        "role": "Giám đốc Phần mềm & Kiến trúc Hệ thống",
        "experience_years": 40,
        "specialty": "40 năm kinh nghiệm kiến trúc phần mềm: Phân tích toàn diện hệ thống, đối chiếu đối thủ công nghệ (Toast POS, Olo, Square, Meituan...), bóc tách mặt lợi & tiêu cực, đánh giá khả năng đáp ứng % và đề xuất giải pháp mềm.",
        "status": "idle",
        "current_room": "architect_office",
        "pos_x": 385,
        "pos_y": 620,
        "target_x": 385,
        "target_y": 620,
        "avatar_color": "#ec4899",  # Hồng tím Giám đốc Phần mềm
    },
    {
        "code": "dung_3",
        "name": "Dũng 3",
        "role": "Senior Fullstack Developer (30 năm KN)",
        "experience_years": 30,
        "specialty": "30 năm kinh nghiệm lập trình: Chỉ thực thi mã nguồn khi Người dùng duyệt từng ý đã thống nhất của Dũng 1 & Dũng 2; viết Clean Code tối ưu, báo cáo nghiệm thu 2 chiều.",
        "status": "coding",
        "current_room": "dev_lab",
        "pos_x": 185,
        "pos_y": 620,
        "target_x": 185,
        "target_y": 620,
        "avatar_color": "#10b981",  # Xanh lá Lập trình viên
    },
]


def init_default_agents(db: Session) -> None:
    """
    Kiểm tra và khởi tạo 3 Agent vào cơ sở dữ liệu nếu chưa tồn tại.
    Đồng thời xóa các agent cũ ngoài 3 Dũng (loại bỏ dung_4).
    """
    valid_codes = {a["code"] for a in DEFAULT_AGENTS}
    
    # Xóa các agent không còn trong danh sách (dung_4)
    db.query(AgentModel).filter(~AgentModel.code.in_(valid_codes)).delete(synchronize_session=False)

    for agent_data in DEFAULT_AGENTS:
        existing = db.query(AgentModel).filter(AgentModel.code == agent_data["code"]).first()
        if not existing:
            agent = AgentModel(**agent_data)
            db.add(agent)
        else:
            existing.name = agent_data["name"]
            existing.role = agent_data["role"]
            existing.experience_years = agent_data["experience_years"]
            existing.specialty = agent_data["specialty"]
            existing.current_room = agent_data["current_room"]
            existing.pos_x = agent_data["pos_x"]
            existing.pos_y = agent_data["pos_y"]
            existing.target_x = agent_data["target_x"]
            existing.target_y = agent_data["target_y"]
            existing.status = agent_data["status"]
            existing.avatar_color = agent_data["avatar_color"]
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
