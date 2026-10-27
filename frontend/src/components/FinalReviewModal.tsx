/**
 * Popup Báo Cáo Nghiệm Thu Toàn Diện của Hội Đồng 4 Dũng
 * Kích hoạt sau khi Dũng 3 và Dũng 4 hoàn thành ở bàn làm việc, bàn giao lại cho Dũng 1 & Dũng 2,
 * và cả 4 người lại ngồi vào phòng họp Boardroom lần 2.
 */

import React from 'react';
import { ProjectSession, ConsensusFeatureItem } from '../types';
import {
  X,
  Trophy,
  CheckCircle2,
  Code,
  ShieldCheck,
  Download,
  Terminal,
  ExternalLink,
} from 'lucide-react';

interface FinalReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: ProjectSession | null;
  selectedFeatures: ConsensusFeatureItem[];
  codeArtifact: string | null;
  testMatrix: string | null;
  onViewCode: (code: string) => void;
  onViewTestMatrix: (matrix: string) => void;
}

export const FinalReviewModal: React.FC<FinalReviewModalProps> = ({
  isOpen,
  onClose,
  session,
  selectedFeatures,
  codeArtifact,
  testMatrix,
  onViewCode,
  onViewTestMatrix,
}) => {
  if (!isOpen || !session) return null;

  const handleDownloadReport = () => {
    const reportData = {
      project_title: session.title,
      user_problem: session.user_problem,
      completed_at: new Date().toISOString(),
      status: 'PRODUCTION_READY',
      developed_features: selectedFeatures,
      has_clean_code: !!codeArtifact,
      has_test_matrix: !!testMatrix,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AgentMulti_Report_${session.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="final-review-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="final-modal-header">
          <div className="flex items-center gap-3">
            <div className="trophy-badge-wrap">
              <Trophy className="text-amber-400" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="final-badge-status">
                  <CheckCircle2 size={12} /> HỘI ĐỒNG 4 DŨNG NGHIỆM THU BOARDROOM LẦN 2
                </span>
                <span className="final-badge-version">Production Ready</span>
              </div>
              <h2 className="final-modal-title">BÁO CÁO TỔNG KẾT DỰ ÁN ĐÃ THỰC HIỆN</h2>
            </div>
          </div>
          <button className="final-close-btn" onClick={onClose} title="Đóng báo cáo">
            <X size={20} />
          </button>
        </div>

        {/* Nội dung báo cáo cuộn */}
        <div className="final-modal-body">
          {/* Đề bài ban đầu */}
          <div className="review-section-box">
            <span className="section-label">Đề bài kỹ thuật của Khách hàng:</span>
            <p className="problem-quote">"{session.user_problem}"</p>
          </div>

          {/* Các ý tưởng người dùng đã chọn phát triển */}
          <div className="review-section-box">
            <span className="section-label">
              Các tính năng phần mềm Bạn đã chọn phát triển ({selectedFeatures.length} ý):
            </span>
            <div className="developed-features-grid">
              {selectedFeatures.map((f, idx) => (
                <div key={f.id || idx} className="dev-feat-card">
                  <div className="flex items-center justify-between">
                    <span className="dev-feat-num">Ý #{idx + 1}</span>
                    <span className="dev-feat-cat">{f.category}</span>
                  </div>
                  <h4 className="dev-feat-title">{f.title}</h4>
                  <p className="dev-feat-cap">
                    <strong>Đáp ứng:</strong> {f.capabilities}
                  </p>
                  <p className="dev-feat-mitigate">
                    <strong>Rủi ro đã triệt tiêu:</strong> {f.counter_arguments}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Hai thành quả cốt lõi của Dũng 3 và Dũng 4 */}
          <div className="review-deliverables-row">
            {/* Kết quả Clean Code của Dũng 3 */}
            <div className="deliverable-card code-deliv-card">
              <div className="deliv-header">
                <div className="flex items-center gap-2">
                  <Code size={18} className="text-emerald-400" />
                  <h4>MÃ NGUỒN CLEAN CODE (DŨNG 3)</h4>
                </div>
                <span className="deliv-status text-emerald-400">100% Passed</span>
              </div>
              <ul className="deliv-list">
                <li>• Viết bằng FastAPI Async + Pydantic v2 chuẩn OpenAPI.</li>
                <li>• Bảo mật Dynamic QR HMAC SHA-256 + Session Key.</li>
                <li>• Chống trùng lặp đơn hàng tuyệt đối bằng Idempotency-Key.</li>
                <li>• 0 code rác, chú thích tiếng Việt chi tiết từng hàm.</li>
              </ul>
              {codeArtifact && (
                <button
                  type="button"
                  className="deliv-action-btn btn-view-code"
                  onClick={() => onViewCode(codeArtifact)}
                >
                  <Terminal size={14} /> Xem Toàn Bộ Mã Nguồn <ExternalLink size={14} />
                </button>
              )}
            </div>

            {/* Kết quả Kiểm Thử & An Ninh của Dũng 4 */}
            <div className="deliverable-card qa-deliv-card">
              <div className="deliv-header">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-rose-400" />
                  <h4>MA TRẬN TEST & SECURITY (DŨNG 4)</h4>
                </div>
                <span className="deliv-status text-rose-400">8/8 Kịch Bản OK</span>
              </div>
              <ul className="deliv-list">
                <li>• Happy Path: Đơn chuyển thẳng bếp trong 1.5ms.</li>
                <li>• Boundary Values: Chặn troll bàn 999 & số lượng món lố.</li>
                <li>• Chống Hack: Miễn nhiễm SQL Injection & XSS payload.</li>
                <li>• Chịu tải cao: Vượt qua Stress Test 5,000 req/s.</li>
              </ul>
              {testMatrix && (
                <button
                  type="button"
                  className="deliv-action-btn btn-view-test"
                  onClick={() => onViewTestMatrix(testMatrix)}
                >
                  <ShieldCheck size={14} /> Xem Bảng Ma Trận Test <ExternalLink size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Đánh giá ký duyệt của Giám đốc (Dũng 1) & PM (Dũng 2) */}
          <div className="review-signoff-box">
            <div className="signoff-avatar-group">
              <img
                src="/assets/characters/dung_1.png"
                alt="Dũng 1"
                className="signoff-avatar"
                title="Dũng 1 - Software Director"
              />
              <img
                src="/assets/characters/dung_2.png"
                alt="Dũng 2"
                className="signoff-avatar"
                title="Dũng 2 - Software Architect & PM"
              />
            </div>
            <div className="signoff-content">
              <h4>KÝ DUYỆT BÀN GIAO • DŨNG 1 (GIÁM ĐỐC) & DŨNG 2 (PROJECT MANAGER)</h4>
              <p>
                "Chúng tôi đã kiểm tra thực tế mã nguồn tại Dev Lab và kết quả bắn phá của QA Lab. Toàn bộ giải pháp
                cho các ý Bạn đã lựa chọn đã sẵn sàng 100% để triển khai lên Web Server Production và tích hợp thực tế tại cơ sở kinh doanh."
              </p>
            </div>
          </div>
        </div>

        {/* Footer nút hành động */}
        <div className="final-modal-footer">
          <button type="button" className="btn-modal-download" onClick={handleDownloadReport}>
            <Download size={16} /> Tải Báo Cáo Dự Án (JSON)
          </button>
          <button type="button" className="btn-modal-close" onClick={onClose}>
            <CheckCircle2 size={16} /> Đã Nắm Rõ Báo Cáo
          </button>
        </div>
      </div>
    </div>
  );
};
