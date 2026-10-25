"""
Router kích hoạt và điều khiển chu trình làm việc của 4 Agent.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ProjectSessionModel
from app.schemas import WorkflowStepTrigger, WorkflowApprovePayload, DeliberationMessageResponse
from app.services.workflow_engine import WorkflowEngine

router = APIRouter(prefix="/api/workflow", tags=["Workflow (Quy trình hợp tác 4 Dũng)"])


@router.post("/trigger", response_model=List[DeliberationMessageResponse], summary="Kích hoạt quy trình 4 Dũng")
def trigger_workflow_step(payload: WorkflowStepTrigger, db: Session = Depends(get_db)):
    """
    Kích hoạt một bước hoặc chặng thảo luận:
    - `full_cycle`: Chạy chặng 1 thảo luận sâu giữa Dũng 1 (Thị trường/Vận hành) và Dũng 2 (Hệ thống/Kỹ thuật), sau đó chuyển sang trạng thái 'waiting_approval' để chờ Người dùng duyệt.
    - `director`: Chỉ chạy Dũng 1 (Nghiên cứu thị trường & Phân tích rủi ro vận hành).
    - `architect`: Chỉ chạy Dũng 2 (Phản biện rủi ro hệ thống & Thiết kế giải pháp kiến trúc).
    - `developer`: Kích hoạt Dũng 3 viết code.
    - `qa`: Kích hoạt Dũng 4 lập ma trận kiểm thử.
    """
    session = db.query(ProjectSessionModel).filter(ProjectSessionModel.id == payload.session_id).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy phiên làm việc ID {payload.session_id}"
        )

    step = payload.step.lower()
    results = []

    if step in ["full_cycle", "deliberate"]:
        # Chạy chặng 1: Dũng 1 + Dũng 2 tranh luận, DỪNG LẠI chờ phê duyệt
        results = WorkflowEngine.run_strategy_deliberation(db, session.id)
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


@router.post("/approve", response_model=List[DeliberationMessageResponse], summary="Phê duyệt phương án & Cho phép Dũng 3, Dũng 4 thực hiện")
def approve_workflow_plan(payload: WorkflowApprovePayload, db: Session = Depends(get_db)):
    """
    Cổng kiểm soát Người dùng (Human-in-the-Loop Gate):
    Sau khi Dũng 1 và Dũng 2 đã phân tích và chốt kiến trúc, người dùng nhấn Phê duyệt để:
    - Cho phép Dũng 3 (Senior Fullstack Dev) tiến hành viết Clean Code.
    - Cho phép Dũng 4 (Test Lead) thiết lập ma trận kiểm thử và quét an ninh.
    """
    session = db.query(ProjectSessionModel).filter(ProjectSessionModel.id == payload.session_id).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy phiên làm việc ID {payload.session_id}"
        )

    results = WorkflowEngine.approve_and_execute_implementation(db, session.id)
    return results
