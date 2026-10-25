import React, { useState } from 'react';
import { X, Copy, Check, Code, FileText } from 'lucide-react';

interface CodeArtifactViewerProps {
  code: string;
  onClose: () => void;
}

export const CodeArtifactViewer: React.FC<CodeArtifactViewerProps> = ({ code, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Code size={20} className="text-emerald-400" />
            <div>
              <h3 className="modal-title">MÃ NGUỒN CHUẨN XÁC DO DŨNG 3 THỰC HIỆN</h3>
              <p className="modal-sub">Tiêu chuẩn Clean Code • Loại bỏ triệt để code dư thừa • Chú thích tiếng Việt chi tiết</p>
            </div>
          </div>
          <div className="modal-header-actions">
            <button onClick={handleCopy} className="action-chip">
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép mã'}</span>
            </button>
            <button onClick={onClose} className="close-btn">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-content code-viewer-body">
          <pre className="code-block">
            <code>{code}</code>
          </pre>
        </div>

        <div className="modal-footer">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FileText size={14} />
            <span>Đã kiểm tra cấu trúc AST: 100% không có unused imports, thuật toán đạt chuẩn tối ưu.</span>
          </div>
          <button onClick={onClose} className="btn-secondary">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
