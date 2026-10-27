import React, { useState } from 'react';
import {
  Play,
  Sparkles,
  Cpu,
  ArrowRight,
  Terminal,
  Trophy,
} from 'lucide-react';

interface WorkflowPanelProps {
  onRunWorkflow: (problem: string, step: string) => Promise<void>;
  isLoading: boolean;
  currentStage: string;
  workflowStage?: string; // initial, waiting_feature_selection, ready_for_workstations, finished
  onExecuteWorkstations?: () => Promise<void>;
  onOpenFinalModal?: () => void;
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
  workflowStage,
  onExecuteWorkstations,
  onOpenFinalModal,
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
          <h2>GIAO ĐỀ BÀI CHO HỘI ĐỒNG 4 DŨNG</h2>
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
          rows={2}
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

      {/* BANNER BƯỚC 3: SẴN SÀNG VỀ BÀN LÀM VIỆC */}
      {workflowStage === 'ready_for_workstations' && onExecuteWorkstations && (
        <div className="workstation-dispatch-banner animate-fade-in">
          <div className="dispatch-header">
            <Terminal className="text-emerald-400" size={20} />
            <div>
              <span className="dispatch-badge">ĐÃ TRANH LUẬN CHUYÊN SÂU XONG TẠI PHÒNG HỌP</span>
              <h4>4 Dũng đã chốt kế hoạch thực thi! Sẵn sàng về bàn làm việc để viết code & chạy test</h4>
            </div>
          </div>
          <p className="dispatch-desc">
            Dũng 1 (Giám đốc) và Dũng 2 (PM) đã phân tích kỹ mặt hạn chế & rủi ro của các ý bạn chọn.
            Dũng 3 đã cam kết cấu trúc Clean Code và Dũng 4 đã lên ma trận 8 kịch bản kiểm thử:
          </p>
          <button
            type="button"
            onClick={onExecuteWorkstations}
            disabled={isLoading}
            className="action-btn-dispatch"
          >
            <Cpu size={18} />
            <span>⚡ LỆNH CHO CẢ 4 DŨNG VỀ BÀN LÀM VIỆC: DŨNG 3 VIẾT CODE & DŨNG 4 TEST</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* BANNER BƯỚC 5: ĐÃ HOÀN TẤT & HỌP LẦN 2 */}
      {workflowStage === 'finished' && onOpenFinalModal && (
        <div className="finished-review-banner animate-fade-in">
          <div className="flex items-center gap-2">
            <Trophy className="text-amber-400" size={20} />
            <div>
              <span className="text-xs text-amber-300 font-semibold tracking-wider uppercase">Nghiệm thu hoàn tất</span>
              <h4 className="text-sm font-bold text-white">4 Dũng đã họp lại tại Boardroom lần 2 và bàn giao kết quả!</h4>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenFinalModal}
            className="btn-open-final-modal"
          >
            <Trophy size={16} /> Xem Báo Cáo Nghiệm Thu Toàn Diện
          </button>
        </div>
      )}

      {/* Nút kích hoạt chính */}
      <div className="workflow-actions-grid">
        <button
          onClick={() => handleSubmit('full_cycle')}
          disabled={isLoading || !problem.trim()}
          className="action-btn-primary"
        >
          <Play size={18} />
          <span>KÍCH HOẠT HỘI ĐỒNG 4 DŨNG: HỌP BÀN TRÒN & TRANH LUẬN ĐA CHIỀU (VÒNG 1)</span>
        </button>
      </div>
    </div>
  );
};
