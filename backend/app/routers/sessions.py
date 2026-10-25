"""
Router quản lý các phiên giải quyết đề bài người dùng (Sessions & Deliberations).
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ProjectSessionModel, DeliberationMessageModel
from app.schemas import ProjectSessionCreate, ProjectSessionResponse, DeliberationMessageResponse

router = APIRouter(prefix="/api/sessions", tags=["Sessions (Đề bài & Phiên thảo luận)"])


@router.get("", response_model=List[ProjectSessionResponse], summary="Lấy danh sách các phiên làm việc")
def list_sessions(db: Session = Depends(get_db)):
    """
    Trả về toàn bộ các phiên làm việc và đề bài đã gửi tới 4 Dũng.
    """
    sessions = db.query(ProjectSessionModel).order_by(ProjectSessionModel.id.desc()).all()
    return sessions


@router.post("", response_model=ProjectSessionResponse, status_code=status.HTTP_201_CREATED, summary="Tạo phiên làm việc mới")
def create_session(payload: ProjectSessionCreate, db: Session = Depends(get_db)):
    """
    Tạo mới một đề bài cần 4 Dũng hợp tác giải quyết.
    """
    title = payload.title.strip() if payload.title else f"Nhiệm vụ: {payload.user_problem[:40]}..."
    session = ProjectSessionModel(
        title=title,
        user_problem=payload.user_problem,
        status="pending",
        current_stage="idle"
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/{session_id}", response_model=ProjectSessionResponse, summary="Xem chi tiết phiên làm việc")
def get_session_detail(session_id: int, db: Session = Depends(get_db)):
    """
    Lấy chi tiết đề bài cùng toàn bộ tin nhắn thảo luận, mã nguồn và kết quả kiểm thử.
    """
    session = db.query(ProjectSessionModel).filter(ProjectSessionModel.id == session_id).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy phiên làm việc ID: {session_id}"
        )
    return session


@router.get("/{session_id}/messages", response_model=List[DeliberationMessageResponse], summary="Lấy lịch sử tin nhắn")
def get_session_messages(session_id: int, db: Session = Depends(get_db)):
    """
    Lấy toàn bộ tin nhắn trao đổi của 4 Dũng trong phiên chỉ định.
    """
    messages = db.query(DeliberationMessageModel)\
        .filter(DeliberationMessageModel.session_id == session_id)\
        .order_by(DeliberationMessageModel.id.asc())\
        .all()
    return messages
