"""
Module kết nối Database bằng SQLAlchemy 2.0.
Hỗ trợ Microsoft SQL Server (pyodbc + ODBC Driver 18) và SQLite fallback.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# Lấy URL kết nối hiệu lực
db_url = settings.effective_db_url

# Thiết lập connect_args phù hợp với từng loại Database
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

# Khởi tạo engine của SQLAlchemy 2.0
engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True,  # Tự động kiểm tra và kết nối lại nếu kết nối DB bị ngắt
    echo=False
)

# Khởi tạo session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class định nghĩa các models
Base = declarative_base()


def get_db():
    """
    Dependency cung cấp database session cho từng request trong FastAPI.
    Đảm bảo đóng kết nối an toàn sau khi hoàn thành request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
