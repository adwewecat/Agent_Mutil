"""
Module định nghĩa các Pydantic Schemas theo chuẩn OpenAPI.
Dùng để xác thực dữ liệu đầu vào và định dạng phản hồi API.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


# -----------------------------------------------------------------------------
# Agent Schemas
# -----------------------------------------------------------------------------
class AgentBase(BaseModel):
    code: str = Field(..., description="Mã định danh của Agent: dung_1, dung_2, dung_3, dung_4")
    name: str = Field(..., description="Tên hiển thị: Dũng 1, Dũng 2, Dũng 3, Dũng 4")
    role: str = Field(..., description="Chức danh đảm nhiệm")
    experience_years: int = Field(default=40, description="Số năm kinh nghiệm")
    specialty: str = Field(..., description="Chuyên môn nổi bật")
    status: str = Field(default="idle", description="Trạng thái hiện tại: idle, moving, debating, coding, testing")
    current_room: str = Field(default="lounge", description="Phòng hiện tại trong văn phòng")
    pos_x: int = Field(default=100, description="Tọa độ X trên Canvas")
    pos_y: int = Field(default=100, description="Tọa độ Y trên Canvas")
    target_x: int = Field(default=100, description="Tọa độ X đích đến")
    target_y: int = Field(default=100, description="Tọa độ Y đích đến")
    avatar_color: str = Field(default="#4f46e5", description="Mã màu đại diện")


class AgentUpdatePosition(BaseModel):
    pos_x: int
    pos_y: int
    target_x: Optional[int] = None
    target_y: Optional[int] = None
    current_room: Optional[str] = None
    status: Optional[str] = None


class AgentResponse(AgentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -----------------------------------------------------------------------------
# Deliberation Message Schemas
# -----------------------------------------------------------------------------
class DeliberationMessageResponse(BaseModel):
    id: int
    session_id: int
    agent_code: str
    agent_name: str
    stage: str
    content: str
    code_artifact: Optional[str] = None
    test_matrix: Optional[str] = None
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


# -----------------------------------------------------------------------------
# Project Session Schemas
# -----------------------------------------------------------------------------
class ProjectSessionCreate(BaseModel):
    title: Optional[str] = Field(default="", description="Tiêu đề phiên làm việc (tự sinh nếu để trống)")
    user_problem: str = Field(..., description="Đề bài kỹ thuật hoặc bài toán cần giải quyết")


class ProjectSessionResponse(BaseModel):
    id: int
    title: str
    user_problem: str
    status: str
    current_stage: str
    created_at: datetime
    updated_at: datetime
    messages: List[DeliberationMessageResponse] = []

    model_config = ConfigDict(from_attributes=True)



# -----------------------------------------------------------------------------
# Workflow Trigger Schemas
# -----------------------------------------------------------------------------
class WorkflowStepTrigger(BaseModel):
    session_id: int
    step: str = Field(..., description="director, architect, developer, qa, hoặc full_cycle")


class SystemHealthResponse(BaseModel):
    status: str
    app_name: str
    version: str
    database_type: str
    database_connected: bool
    agents_count: int
