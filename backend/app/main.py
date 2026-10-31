"""
File khởi chạy chính của ứng dụng FastAPI (Backend).
Thiết lập Middleware CORS, nạp cơ sở dữ liệu, khởi tạo dữ liệu mẫu 4 Dũng và gắn các Router.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.config import settings
from app.database import engine, Base, get_db
from app.models import AgentModel
from app.services.office_manager import init_default_agents
from app.schemas import SystemHealthResponse
from app.routers import agents, sessions, workflow, websocket


import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Khởi tạo bảng ngay khi load module app
Base.metadata.create_all(bind=engine)
with Session(bind=engine) as db:
    init_default_agents(db)



@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Vòng đời của ứng dụng FastAPI.
    Đảm bảo Bộ Ba Chuyên Gia Dũng cốt lõi luôn sẵn sàng.
    """
    with Session(bind=engine) as db:
        init_default_agents(db)
        
    print(">>> [VIRTUAL OFFICE]: Ready. 3 Dungs in position!")
    yield
    print(">>> [VIRTUAL OFFICE]: Shutting down...")




# Khởi tạo ứng dụng FastAPI với tài liệu OpenAPI chuẩn hóa
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Hệ thống văn phòng ảo Pixel Art (Agent-Pixels) kết hợp quy trình hội đồng Bộ Ba Chuyên Gia Dũng AI.",
    lifespan=lifespan
)

# Cấu hình CORS để Frontend (React + Vite) kết nối mượt mà
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.ALLOWED_ORIGINS == "*" else settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gắn các Routers chức năng
app.include_router(agents.router)
app.include_router(sessions.router)
app.include_router(workflow.router)
app.include_router(websocket.router)


@app.get("/api/health", response_model=SystemHealthResponse, tags=["System Health"])
def system_health_check(db: Session = Depends(get_db)):
    """
    Kiểm tra tình trạng hoạt động của hệ thống, cơ sở dữ liệu (SQL Server hoặc SQLite)
    và số lượng Agent đang trực ban.
    """
    db_connected = False
    db_type = "SQL Server (pyodbc)" if "mssql" in settings.effective_db_url.lower() else "SQLite"
    
    try:
        db.execute(text("SELECT 1"))
        db_connected = True
    except Exception:
        db_connected = False

    agents_count = db.query(AgentModel).count()

    return SystemHealthResponse(
        status="healthy" if db_connected else "degraded",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        database_type=db_type,
        database_connected=db_connected,
        agents_count=agents_count
    )


@app.get("/", tags=["Root"])
def root_endpoint():
    """
    Trang chào mừng API gốc.
    """
    return {
        "message": "Chào mừng đến với Agent Multi - Virtual Pixel Office API (4 Dũng)",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "health_check": "/api/health"
    }
