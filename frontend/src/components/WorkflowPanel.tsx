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
  onOpenConsensusModal?: () => void;
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
  onOpenConsensusModal,
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
          <h2>GIAO ĐỀ BÀI CHO BỘ BA CHUYÊN GIA (3 NHÂN VIÊN DŨNG)</h2>
        </div>
        {isLoading && (
          <div className="workflow-active-badge">
            <span className="pulsing-dot"></span>
            <span>Hội đồng đang xử lý: {currentStage || 'Đang thực thi...'}</span>
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

      {/* BANNER BƯỚC 2: TRANH LUẬN XONG, CHỜ DUYỆT TỪNG Ý */}
      {workflowStage === 'waiting_feature_selection' && (
        <div className="workstation-dispatch-banner animate-fade-in" style={{ borderColor: '#00f0ff', background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.12), rgba(15, 23, 42, 0.95))' }}>
          <div className="dispatch-header">
            <Sparkles className="text-cyan-400" size={20} />
            <div>
              <span className="dispatch-badge" style={{ background: 'rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}>TRANH LUẬN NẢY LỬA HOÀN TẤT</span>
              <h4>Nhân viên 1 & 2 đã thống nhất Bảng Năng Lực & Rủi Ro! Đang chờ bạn duyệt từng ý</h4>
            </div>
          </div>
          <p className="dispatch-desc">
            Nhân viên 3 (Senior Dev 30 năm KN) chỉ thực hiện khi Bạn duyệt từng ý và cái cần thực thi là gì.
          </p>
          {onOpenConsensusModal && (
            <button
              type="button"
              onClick={onOpenConsensusModal}
              className="action-btn-dispatch"
              style={{ background: 'linear-gradient(135deg, #0284c7, #00f0ff)', color: '#0f172a' }}
            >
              <Sparkles size={18} />
              <span>📋 MỞ BẢNG THỐNG NHẤT (POPUP) ĐỂ DUYỆT CÁC Ý THỰC THI</span>
            </button>
          )}
        </div>
      )}

      {/* BANNER BƯỚC 3: SẴN SÀNG CHO NHÂN VIÊN 3 THỰC THI KHI NGƯỜI DÙNG DUYỆT */}
      {workflowStage === 'ready_for_workstations' && onExecuteWorkstations && (
        <div className="workstation-dispatch-banner animate-fade-in">
          <div className="dispatch-header">
            <Terminal className="text-emerald-400" size={20} />
            <div>
              <span className="dispatch-badge">BẠN ĐÃ DUYỆT CÁC Ý THỰC THI</span>
              <h4>Nhân viên 1 & 2 đã thống nhất xong! Lệnh cho Nhân viên 3 (Senior Dev 30 năm KN) lập trình</h4>
            </div>
          </div>
          <p className="dispatch-desc">
            Nhân viên 1 (GĐ Vận hành F&B 40 năm KN) và Nhân viên 2 (GĐ Phần mềm 40 năm KN) đã khóa đặc tả kỹ thuật.
            Nhân viên 3 (Senior Dev 30 năm KN) chỉ thực sự làm việc theo đúng các ý bạn đã phê duyệt:
          </p>
          <button
            type="button"
            onClick={onExecuteWorkstations}
            disabled={isLoading}
            className="action-btn-dispatch"
          >
            <Cpu size={18} />
            <span>⚡ LỆNH CHO NHÂN VIÊN 3 VÀO DEV LAB VIẾT CLEAN CODE & KIỂM THỬ</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* BANNER BƯỚC 5: ĐÃ HOÀN TẤT & NGHIỆM THU */}
      {workflowStage === 'finished' && onOpenFinalModal && (
        <div className="finished-review-banner animate-fade-in">
          <div className="flex items-center gap-2">
            <Trophy className="text-amber-400" size={20} />
            <div>
              <span className="text-xs text-amber-300 font-semibold tracking-wider uppercase">Nghiệm thu hoàn tất</span>
              <h4 className="text-sm font-bold text-white">
                Nhân viên 3 đã nộp code! Nhân viên 1 & Nhân viên 2 đã đánh giá và nghiệm thu toàn diện.
              </h4>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenFinalModal}
            className="btn-open-final-modal"
          >
            <Trophy size={16} /> Xem Popup Nghiệm Thu Của Nhân Viên 1 & 2
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
          <span>KÍCH HOẠT NHÂN VIÊN 1 & 2 TRANH LUẬN NẢY LỬA (ĐỐI CHIẾU THỊ TRƯỜNG & LẬP BẢNG THỐNG NHẤT)</span>
        </button>
      </div>
    </div>
  );
};
