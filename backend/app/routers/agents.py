"""
Router quản lý danh sách Agent và điều phối di chuyển trên văn phòng ảo.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AgentModel
from app.schemas import AgentResponse, AgentUpdatePosition
from app.services.office_manager import move_agent_to_room, ROOM_COORDINATES

router = APIRouter(prefix="/api/agents", tags=["Agents (Bộ tứ Dũng)"])


@router.get("", response_model=List[AgentResponse], summary="Lấy danh sách 4 Dũng")
def get_all_agents(db: Session = Depends(get_db)):
    """
    Trả về toàn bộ thông tin 4 Agent: Dũng 1, Dũng 2, Dũng 3, Dũng 4.
    Bao gồm vai trò, số năm kinh nghiệm, vị trí tọa độ và trạng thái hiện tại.
    """
    agents = db.query(AgentModel).order_by(AgentModel.id.asc()).all()
    return agents


@router.get("/{code}", response_model=AgentResponse, summary="Xem chi tiết Agent theo mã")
def get_agent_by_code(code: str, db: Session = Depends(get_db)):
    """
    Lấy thông tin chi tiết của một Agent theo mã (dung_1, dung_2, dung_3, dung_4).
    """
    agent = db.query(AgentModel).filter(AgentModel.code == code).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy Agent với mã: {code}"
        )
    return agent


@router.post("/{code}/move-to-room", response_model=AgentResponse, summary="Điều động Agent sang phòng làm việc khác")
def dispatch_agent_to_room(code: str, room: str, db: Session = Depends(get_db)):
    """
    Chuyển Agent sang phòng làm việc chỉ định:
    - director_office
    - architect_office
    - boardroom
    - dev_lab
    - qa_lab
    - lounge
    """
    if room not in ROOM_COORDINATES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Phòng không hợp lệ. Các phòng có sẵn: {list(ROOM_COORDINATES.keys())}"
        )
    agent = move_agent_to_room(db, code, room, status="moving")
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy Agent với mã: {code}"
        )
    return agent


@router.put("/{code}/position", response_model=AgentResponse, summary="Cập nhật tọa độ di chuyển tức thì")
def update_agent_position(code: str, update: AgentUpdatePosition, db: Session = Depends(get_db)):
    """
    Cập nhật vị trí tọa độ của Agent khi đang di chuyển trên Canvas (dùng cho đồng bộ engine).
    """
    agent = db.query(AgentModel).filter(AgentModel.code == code).first()
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent không tồn tại")
    
    agent.pos_x = update.pos_x
    agent.pos_y = update.pos_y
    if update.target_x is not None:
        agent.target_x = update.target_x
    if update.target_y is not None:
        agent.target_y = update.target_y
    if update.current_room is not None:
        agent.current_room = update.current_room
    if update.status is not None:
        agent.status = update.status

    db.commit()
    db.refresh(agent)
    return agent
