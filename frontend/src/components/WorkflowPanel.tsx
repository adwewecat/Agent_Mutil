import React, { useState } from 'react';
import { Play, Sparkles, Send, ShieldAlert, Cpu } from 'lucide-react';


interface WorkflowPanelProps {
  onRunWorkflow: (problem: string, step: string) => Promise<void>;
  isLoading: boolean;
  currentStage: string;
}

const SAMPLE_PROBLEMS = [
  'Xây dựng hệ thống khớp lệnh giao dịch tài chính 50,000 TPS kết nối SQL Server và FastAPI.',
  'Thiết kế kiến trúc Cache phân tán đa tầng giảm 95% tải đọc I/O cho cơ sở dữ liệu lớn.',
  'Xây dựng module xác thực phân quyền RBAC & OAuth2 an toàn chống tấn công CSRF, XSS và SQL Injection.',
];

export const WorkflowPanel: React.FC<WorkflowPanelProps> = ({
  onRunWorkflow,
  isLoading,
  currentStage,
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
        <span className="sample-label">Gợi ý mẫu:</span>
        {SAMPLE_PROBLEMS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setProblem(sample)}
            disabled={isLoading}
            className="sample-prompt-btn"
          >
            Mẫu #{idx + 1}
          </button>
        ))}
      </div>

      {/* Bảng nút kích hoạt */}
      <div className="workflow-actions-grid">
        <button
          onClick={() => handleSubmit('full_cycle')}
          disabled={isLoading || !problem.trim()}
          className="action-btn-primary"
        >
          <Play size={18} />
          <span>KÍCH HOẠT TOÀN BỘ QUY TRÌNH (4 DŨNG)</span>
        </button>

        <div className="step-actions-row">
          <button
            onClick={() => handleSubmit('director')}
            disabled={isLoading || !problem.trim()}
            className="action-btn-step step-director"
            title="Dũng 1 phân tích đề bài và đề xuất giải pháp"
          >
            <Send size={14} />
            <span>1. Dũng 1 Đề xuất</span>
          </button>

          <button
            onClick={() => handleSubmit('architect')}
            disabled={isLoading || !problem.trim()}
            className="action-btn-step step-architect"
            title="Dũng 2 thẩm định rủi ro, phản biện và chốt kiến trúc"
          >
            <Cpu size={14} />
            <span>2. Dũng 2 Phản biện</span>
          </button>

          <button
            onClick={() => handleSubmit('developer')}
            disabled={isLoading || !problem.trim()}
            className="action-btn-step step-developer"
            title="Dũng 3 hiện thực hóa mã nguồn sạch chuẩn xác"
          >
            <Sparkles size={14} />
            <span>3. Dũng 3 Viết Code</span>
          </button>

          <button
            onClick={() => handleSubmit('qa')}
            disabled={isLoading || !problem.trim()}
            className="action-btn-step step-qa"
            title="Dũng 4 lập ma trận kiểm thử và quét an ninh"
          >
            <ShieldAlert size={14} />
            <span>4. Dũng 4 Stress Test</span>
          </button>
        </div>
      </div>
    </div>
  );
};
