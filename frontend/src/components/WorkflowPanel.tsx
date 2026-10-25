import React, { useState } from 'react';
import { Play, Sparkles, Send, ShieldAlert, Cpu, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface WorkflowPanelProps {
  onRunWorkflow: (problem: string, step: string) => Promise<void>;
  isLoading: boolean;
  currentStage: string;
  isWaitingApproval?: boolean;
  onApproveWorkflow?: () => Promise<void>;
}

const SAMPLE_PROBLEMS = [
  'Phân tích rủi ro khi triển khai QR Code order menu cho khách hàng, đánh giá rủi ro vận hành & rủi ro hệ thống, kiến trúc giải pháp chống gian lận và rớt đơn.',
  'Xây dựng hệ thống khớp lệnh giao dịch tài chính 50,000 TPS kết nối SQL Server và FastAPI.',
  'Thiết kế kiến trúc Cache phân tán đa tầng giảm 95% tải đọc I/O cho cơ sở dữ liệu lớn.',
  'Xây dựng module xác thực phân quyền RBAC & OAuth2 an toàn chống tấn công CSRF, XSS và SQL Injection.',
];

export const WorkflowPanel: React.FC<WorkflowPanelProps> = ({
  onRunWorkflow,
  isLoading,
  currentStage,
  isWaitingApproval = false,
  onApproveWorkflow,
}) => {
  const [problem, setProblem] = useState(SAMPLE_PROBLEMS[0]);

  const handleSubmit = (step: string) => {
    if (!problem.trim() || isLoading) return;
    onRunWorkflow(problem.trim(), step);
  };

  return (
    <div className="workflow-card">
      <div className="workflow-card-header">
        <div className="workflow-title-wrap">
          <Sparkles className="text-yellow-400" size={18} />
          <h2>GIAO ĐỀ BÀI CHO BỘ TỨ DŨNG</h2>
        </div>
        {isLoading && (
          <div className="workflow-active-badge">
            <span className="pulsing-dot"></span>
            <span>Hội đồng 4 Dũng đang xử lý: {currentStage || 'Đang thực thi...'}</span>
          </div>
        )}
      </div>

      <div className="problem-input-group">
        <textarea
          rows={3}
          value={problem}
          onChange={e => setProblem(e.target.value)}
          placeholder="Nhập yêu cầu phần mềm hoặc bài toán kỹ thuật tại đây..."
          className="problem-textarea"
          disabled={isLoading}
        />
      </div>

      {/* Gợi ý mẫu */}
      <div className="sample-prompts-bar">
        <span className="sample-label">Gợi ý bài toán:</span>
        {SAMPLE_PROBLEMS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setProblem(sample)}
            disabled={isLoading}
            className={`sample-prompt-btn ${idx === 0 ? 'sample-prompt-btn-highlight' : ''}`}
            title={sample}
          >
            {idx === 0 ? '🔥 QR Code Order Menu' : `Mẫu #${idx + 1}`}
          </button>
        ))}
      </div>

      {/* CỔNG PHÊ DUYỆT CHIẾN LƯỢC (HUMAN-IN-THE-LOOP APPROVAL GATE) */}
      {isWaitingApproval && (
        <div className="approval-gate-banner animate-fade-in">
          <div className="approval-gate-header">
            <AlertTriangle className="text-amber-400" size={20} />
            <div className="approval-gate-title">
              <span className="approval-badge">CHỜ NGƯỜI DÙNG PHÊ DUYỆT</span>
              <h3>Dũng 1 (Thị trường/Vận hành) & Dũng 2 (Hệ thống/Kiến trúc) đã chốt phương án</h3>
            </div>
          </div>
          <p className="approval-gate-desc">
            Quy trình được thiết kế chuẩn mực: Hai chuyên gia đầu não đã hoàn tất phân tích thị trường, tâm lý khách hàng,
            rủi ro rớt đơn, nguy cơ tráo mã QR và chốt giải pháp Dynamic QR HMAC + Local SQLite Sync.
            <strong> Dũng 3 (Lập trình) và Dũng 4 (Kiểm thử) chỉ được phép thực hiện khi bạn bấm Phê duyệt dưới đây:</strong>
          </p>
          <div className="approval-gate-action">
            <button
              onClick={() => onApproveWorkflow && onApproveWorkflow()}
              disabled={isLoading}
              className="action-btn-approve"
            >
              <CheckCircle2 size={18} />
              <span>PHÊ DUYỆT PHƯƠNG ÁN & KÍCH HOẠT DŨNG 3, DŨNG 4 THỰC THI</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Bảng nút kích hoạt */}
      <div className="workflow-actions-grid">
        <button
          onClick={() => handleSubmit('full_cycle')}
          disabled={isLoading || !problem.trim()}
          className="action-btn-primary"
        >
          <Play size={18} />
          <span>KÍCH HOẠT QUY TRÌNH (DŨNG 1 & DŨNG 2 TRANH LUẬN CHIẾN LƯỢC)</span>
        </button>

        <div className="step-actions-row">
          <button
            onClick={() => handleSubmit('director')}
            disabled={isLoading || !problem.trim()}
            className="action-btn-step step-director"
            title="Dũng 1 nghiên cứu thị trường và rủi ro vận hành"
          >
            <Send size={14} />
            <span>1. Dũng 1 (Thị trường)</span>
          </button>

          <button
            onClick={() => handleSubmit('architect')}
            disabled={isLoading || !problem.trim()}
            className="action-btn-step step-architect"
            title="Dũng 2 phản biện rủi ro hệ thống và chốt kiến trúc"
          >
            <Cpu size={14} />
            <span>2. Dũng 2 (Hệ thống)</span>
          </button>

          <button
            onClick={() => handleSubmit('developer')}
            disabled={isLoading || !problem.trim()}
            className="action-btn-step step-developer"
            title="Dũng 3 hiện thực hóa mã nguồn sạch chuẩn xác"
          >
            <Sparkles size={14} />
            <span>3. Dũng 3 (Code)</span>
          </button>

          <button
            onClick={() => handleSubmit('qa')}
            disabled={isLoading || !problem.trim()}
            className="action-btn-step step-qa"
            title="Dũng 4 lập ma trận kiểm thử và quét an ninh"
          >
            <ShieldAlert size={14} />
            <span>4. Dũng 4 (Stress Test)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
