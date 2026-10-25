"""
Router kích hoạt và điều khiển chu trình làm việc của 4 Agent.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ProjectSessionModel
from app.schemas import WorkflowStepTrigger, DeliberationMessageResponse
from app.services.workflow_engine import WorkflowEngine

router = APIRouter(prefix="/api/workflow", tags=["Workflow (Quy trình hợp tác 4 Dũng)"])


@router.post("/trigger", response_model=List[DeliberationMessageResponse], summary="Kích hoạt quy trình 4 Dũng")
def trigger_workflow_step(payload: WorkflowStepTrigger, db: Session = Depends(get_db)):
    """
    Kích hoạt một bước hoặc toàn bộ chu trình giải quyết vấn đề:
    - `full_cycle`: Chạy toàn bộ từ Dũng 1 -> Dũng 2 -> Dũng 3 -> Dũng 4.
    - `director`: Chỉ chạy Dũng 1 (Software Director đề xuất giải pháp).
    - `architect`: Chỉ chạy Dũng 2 (Software Architect phản biện & thẩm định rủi ro).
    - `developer`: Chỉ chạy Dũng 3 (Senior Fullstack Developer sinh mã nguồn sạch).
    - `qa`: Chỉ chạy Dũng 4 (Test Engineer lập ma trận test & quét bảo mật).
    """
    session = db.query(ProjectSessionModel).filter(ProjectSessionModel.id == payload.session_id).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy phiên làm việc ID {payload.session_id}"
        )

    step = payload.step.lower()
    results = []

    if step == "full_cycle":
        results = WorkflowEngine.run_full_pipeline(db, session.id)
    elif step == "director":
        results.append(WorkflowEngine.run_director_stage(db, session))
    elif step == "architect":
        results.append(WorkflowEngine.run_architect_stage(db, session))
    elif step == "developer":
        results.append(WorkflowEngine.run_developer_stage(db, session))
    elif step == "qa":
        results.append(WorkflowEngine.run_qa_stage(db, session))
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Bước '{payload.step}' không hợp lệ. Chọn: director, architect, developer, qa, hoặc full_cycle"
        )

    return results
