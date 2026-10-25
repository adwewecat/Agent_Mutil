"""
Module định nghĩa các ORM Models cho SQLAlchemy 2.0.
Bao gồm: Agent, ProjectSession, DeliberationMessage, OfficeEventLog.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


def utc_now():
    """Hàm sinh thời gian UTC tương thích mọi phiên bản Python"""
    return datetime.now(timezone.utc)



class AgentModel(Base):
    """
    Bảng lưu trữ thông tin của 4 Agent (Dũng 1, Dũng 2, Dũng 3, Dũng 4).
    Lưu vị trí tọa độ trên Canvas Pixel Office và trạng thái làm việc.
    """
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)  # dung_1, dung_2, dung_3, dung_4
    name = Column(String(100), nullable=False)  # Dũng 1, Dũng 2, Dũng 3, Dũng 4
    role = Column(String(150), nullable=False)  # Software Director, Software Architect, Senior Fullstack Dev, Test Engineer
    experience_years = Column(Integer, default=40)  # Số năm kinh nghiệm (Dũng 2, 3, 4 đều 40 năm)
    specialty = Column(Text, nullable=False)  # Mô tả kỹ năng chuyên môn cốt lõi
    status = Column(String(50), default="idle")  # idle, moving, debating, coding, testing, resting
    
    # Tọa độ vị trí trên bản đồ Pixel Office (tính theo ô tile 16x16 hoặc pixel)
    current_room = Column(String(50), default="lounge")  # director_room, architect_room, dev_lab, qa_lab, boardroom, lounge
    pos_x = Column(Integer, default=100)
    pos_y = Column(Integer, default=100)
    target_x = Column(Integer, default=100)
    target_y = Column(Integer, default=100)
    
    # Màu sắc nhận diện và icon
    avatar_color = Column(String(20), default="#4f46e5")
    
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


class ProjectSessionModel(Base):
    """
    Bảng lưu trữ các phiên giải quyết đề bài của người dùng.
    Mỗi phiên sẽ kích hoạt chu trình làm việc của 4 Dũng.
    """
    __tablename__ = "project_sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    user_problem = Column(Text, nullable=False)  # Đề bài người dùng nhập
    status = Column(String(50), default="pending")  # pending, in_progress, completed, failed
    current_stage = Column(String(50), default="idle")  # director_proposal, architect_critique, dev_implementation, qa_validation, finished
    
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Quan hệ với các tin nhắn thảo luận
    messages = relationship("DeliberationMessageModel", back_populates="session", cascade="all, delete-orphan")


class DeliberationMessageModel(Base):
    """
    Bảng lưu lại toàn bộ diễn biến trao đổi, tranh luận, mã nguồn và kết quả test của 4 Agent.
    """
    __tablename__ = "deliberation_messages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey("project_sessions.id", ondelete="CASCADE"), nullable=False)
    agent_code = Column(String(50), nullable=False)  # dung_1, dung_2, dung_3, dung_4
    agent_name = Column(String(100), nullable=False)
    stage = Column(String(50), nullable=False)  # 1_director, 2_architect, 3_developer, 4_qa
    content = Column(Text, nullable=False)  # Nội dung phát biểu / phân tích
    code_artifact = Column(Text, nullable=True)  # Mã nguồn hoàn chỉnh do Dũng 3 viết (nếu có)
    test_matrix = Column(Text, nullable=True)  # Ma trận test cases & kết quả do Dũng 4 kiểm tra (nếu có)
    timestamp = Column(DateTime, default=utc_now)

    # Quan hệ ngược về phiên làm việc
    session = relationship("ProjectSessionModel", back_populates="messages")


class OfficeEventLogModel(Base):
    """
    Bảng ghi lại sự kiện vận hành văn phòng ảo (di chuyển, đổi camera, trạng thái hệ thống).
    """
    __tablename__ = "office_event_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    event_type = Column(String(50), nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

