"""
Module cấu hình hệ thống (Settings & Configuration)
Đọc các biến môi trường và thiết lập tham số cho FastAPI và SQLAlchemy.
"""

import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Lớp cấu hình ứng dụng kế thừa từ Pydantic BaseSettings.
    Hỗ trợ nạp cấu hình từ biến môi trường hoặc file .env.
    """
    model_config = SettingsConfigDict(env_file=".env", extra="allow")

    APP_NAME: str = "Agent Multi - Virtual Pixel Office & Bộ Ba Dũng API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Chuỗi kết nối SQL Server (Ưu tiên cao nhất)
    # Cấu trúc: mssql+pyodbc://user:password@server:port/database?driver=ODBC+Driver+18+for+SQL+Server
    SQL_SERVER_CONNECTION_STRING: str = os.getenv("SQL_SERVER_CONNECTION_STRING", "")
    
    # Database URL fallback (Nếu không có SQL Server, dùng SQLite cục bộ)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./agent_multi.db")
    
    # Danh sách origin được phép gọi API (CORS)
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "*")

    @property
    def effective_db_url(self) -> str:
        """
        Trả về chuỗi kết nối Database thực tế.
        Nếu có cấu hình SQL Server thì dùng SQL Server, ngược lại dùng fallback SQLite.
        """
        if self.SQL_SERVER_CONNECTION_STRING.strip():
            return self.SQL_SERVER_CONNECTION_STRING.strip()
        return self.DATABASE_URL.strip()



# Khởi tạo đối tượng settings dùng chung toàn dự án
settings = Settings()
