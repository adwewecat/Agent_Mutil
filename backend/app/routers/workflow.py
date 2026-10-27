"""
Router kích hoạt và điều khiển chu trình làm việc 5 giai đoạn của 4 Agent.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ProjectSessionModel
from app.schemas import (
    WorkflowStepTrigger,
    WorkflowApprovePayload,
    WorkflowSelectFeaturesPayload,
    DeliberationMessageResponse,
    ConsensusFeatureItem
)
from app.services.workflow_engine import WorkflowEngine

router = APIRouter(prefix="/api/workflow", tags=["Workflow (Quy trình hợp tác 4 Dũng)"])


@router.post("/trigger", response_model=List[DeliberationMessageResponse], summary="Kích hoạt quy trình 4 Dũng")
def trigger_workflow_step(payload: WorkflowStepTrigger, db: Session = Depends(get_db)):
    """
    Kích hoạt một bước hoặc chặng thảo luận:
    - `full_cycle` / `initial_deliberation`: Cả 4 Dũng gom về Boardroom ngồi họp, tranh luận & phản biện lẫn nhau,
      sau đó sinh Bảng Thông Tin Chốt Lại (Consensus Board) và dừng lại chờ người dùng chọn các ý cần phát triển.
    """
    session = db.query(ProjectSessionModel).filter(ProjectSessionModel.id == payload.session_id).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy phiên làm việc ID {payload.session_id}"
        )

    step = payload.step.lower()
    if step in ["full_cycle", "initial_deliberation", "deliberate"]:
        return WorkflowEngine.run_initial_boardroom_deliberation(db, session.id)
    elif step in ["workstations", "execute"]:
        return WorkflowEngine.run_workstations_execution_and_final_review(db, session.id)
    else:
        # Mặc định kích hoạt họp hội đồng 4 Dũng vòng 1
        return WorkflowEngine.run_initial_boardroom_deliberation(db, session.id)


@router.get("/consensus-features/{session_id}", response_model=List[ConsensusFeatureItem], summary="Lấy Bảng Thông Tin Chốt Lại của 4 Dũng")
def get_consensus_features_for_session(session_id: int, db: Session = Depends(get_db)):
    """
    Trả về danh sách các ý tưởng/phương án sau khi 4 Dũng tranh luận vòng 1
    để người dùng tích chọn các dòng cần phát triển phần mềm.
    """
    session = db.query(ProjectSessionModel).filter(ProjectSessionModel.id == session_id).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy phiên làm việc ID {session_id}"
        )
    return WorkflowEngine.get_consensus_features(db, session.id)


@router.post("/select-features", response_model=List[DeliberationMessageResponse], summary="Người dùng chọn các ý phát triển & 4 Dũng tranh luận chuyên sâu")
def select_features_and_deep_dive(payload: WorkflowSelectFeaturesPayload, db: Session = Depends(get_db)):
    """
    GIAI ĐOẠN 3:
    Sau khi người dùng tích chọn các ý trong Bảng Chốt Lại, 4 Dũng tiếp tục tranh luận chuyên sâu
    ngay tại phòng họp: Mặt hạn chế & tiêu cực, đáp ứng được gì, không đáp ứng được gì, rủi ro kỹ thuật.
    """
    session = db.query(ProjectSessionModel).filter(ProjectSessionModel.id == payload.session_id).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy phiên làm việc ID {payload.session_id}"
        )

    results = WorkflowEngine.run_deep_dive_analysis(db, session.id, payload.selected_feature_ids)
    return results


@router.post("/execute-workstations", response_model=List[DeliberationMessageResponse], summary="Về bàn làm việc thực thi & Họp nghiệm thu Boardroom lần 2")
def execute_workstations_and_final_review(payload: WorkflowApprovePayload, db: Session = Depends(get_db)):
    """
    GIAI ĐOẠN 4 & 5:
    - Cả 4 Dũng rời phòng họp về đúng bàn làm việc của mình: Dũng 3 viết code, Dũng 4 chạy test.
    - Xong việc, Dũng 3 & Dũng 4 bàn giao cho Giám đốc (Dũng 1) & PM (Dũng 2).
    - Cả 4 người lại di chuyển ngồi vào Boardroom bàn tròn Hologram 1 lần nữa để nghiệm thu.
    - Kích hoạt Popup Báo Cáo Toàn Diện trên UI.
    """
    session = db.query(ProjectSessionModel).filter(ProjectSessionModel.id == payload.session_id).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy phiên làm việc ID {payload.session_id}"
        )

    results = WorkflowEngine.run_workstations_execution_and_final_review(db, session.id)
    return results


@router.post("/approve", response_model=List[DeliberationMessageResponse], summary="Tương thích ngược: Phê duyệt & thực thi")
def approve_workflow_plan(payload: WorkflowApprovePayload, db: Session = Depends(get_db)):
    """Tương thích ngược cho các phiên bản cũ"""
    return execute_workstations_and_final_review(payload, db)
