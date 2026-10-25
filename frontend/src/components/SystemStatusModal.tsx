import React from 'react';
import { X, Server, Database, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { SystemHealth } from '../types';

interface SystemStatusModalProps {
  health: SystemHealth | null;
  onClose: () => void;
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({ health, onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Server size={22} className="text-cyan-400" />
            <div>
              <h3 className="modal-title">TÌNH TRẠNG HẠ TẦNG & HỆ THỐNG MÁY CHỦ</h3>
              <p className="modal-sub">Thông số kỹ thuật Backend FastAPI, Cơ sở dữ liệu và 4 Dũng AI</p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={18} />
          </button>
        </div>

        <div className="modal-content">
          <div className="status-items-list">
            <div className="status-item-card">
              <div className="status-item-icon">
                <Database size={20} className="text-indigo-400" />
              </div>
              <div className="status-item-details">
                <span className="status-item-label">Cơ sở dữ liệu đang hoạt động:</span>
                <span className="status-item-value">{health?.database_type || 'SQL Server'}</span>
                <p className="status-item-desc">
                  Hỗ trợ Microsoft SQL Server 2019/2022 qua SQLAlchemy 2.0 + pyodbc + ODBC Driver 18, tự động fallback SQLite khi chạy cục bộ.
                </p>
              </div>
              <div className="status-item-badge">
                {health?.database_connected ? (
                  <span className="chip-online">
                    <CheckCircle2 size={14} /> Sẵn sàng
                  </span>
                ) : (
                  <span className="chip-offline">
                    <AlertCircle size={14} /> Mất kết nối
                  </span>
                )}
              </div>
            </div>

            <div className="status-item-card">
              <div className="status-item-icon">
                <Server size={20} className="text-emerald-400" />
              </div>
              <div className="status-item-details">
                <span className="status-item-label">Backend Web Server:</span>
                <span className="status-item-value">FastAPI + Python 3.10+ / 3.12 (Uvicorn ASGI)</span>
                <p className="status-item-desc">
                  Kiến trúc RESTful API đạt chuẩn OpenAPI tự động, kèm kênh WebSocket /ws/office phát sóng thời gian thực.
                </p>
              </div>
              <div className="status-item-badge">
                <span className="chip-online">
                  <CheckCircle2 size={14} /> Trực tuyến
                </span>
              </div>
            </div>

            <div className="status-item-card">
              <div className="status-item-icon">
                <ShieldCheck size={20} className="text-purple-400" />
              </div>
              <div className="status-item-details">
                <span className="status-item-label">Đội ngũ chuyên gia (Agent Team):</span>
                <span className="status-item-value">
                  {health?.agents_count || 4} Nhân sự (Dũng 1, Dũng 2, Dũng 3, Dũng 4)
                </span>
                <p className="status-item-desc">
                  Software Director, Software Architect (40 năm KN), Senior Fullstack Dev (40 năm KN), Test Engineer (40 năm KN).
                </p>
              </div>
              <div className="status-item-badge">
                <span className="chip-online">
                  <CheckCircle2 size={14} /> Đầy đủ 4 Dũng
                </span>
              </div>
            </div>
          </div>

          <div className="openapi-quick-link">
            <span>Truy cập trực tiếp tài liệu tương tác:</span>
            <a href="/docs" target="_blank" rel="noreferrer" className="link-with-icon">
              <span>Swagger UI (/docs)</span>
              <ExternalLink size={14} />
            </a>
            <a href="/redoc" target="_blank" rel="noreferrer" className="link-with-icon">
              <span>ReDoc (/redoc)</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
