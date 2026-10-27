/**
 * Component hiển thị BẢNG THÔNG TIN THỐNG NHẤT CỦA NHÂN VIÊN 1 & NHÂN VIÊN 2.
 * Được xây dựng sau màn tranh luận nảy lửa giữa:
 * - Nhân viên 1: Giám đốc Vận hành & Chiến lược F&B (40 năm kinh nghiệm)
 * - Nhân viên 2: Giám đốc Phần mềm & Kiến trúc Hệ thống (40 năm kinh nghiệm)
 * Người dùng tích chọn duyệt từng ý để Nhân viên 3 (Senior Dev 30 năm kinh nghiệm) bắt đầu thực thi.
 */

import React, { useState } from 'react';
import { ConsensusFeatureItem } from '../types';
import {
  CheckSquare,
  Square,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  ArrowRight,
  ShieldAlert,
  Percent,
  CheckCircle,
  HelpCircle,
  Code2,
  Workflow,
  Globe2,
} from 'lucide-react';

interface ConsensusBoardProps {
  features: ConsensusFeatureItem[];
  selectedFeatureIds: string[];
  onToggleFeature: (featureId: string) => void;
  onSubmitSelected: () => void;
  isLoading: boolean;
}

export const ConsensusBoard: React.FC<ConsensusBoardProps> = ({
  features,
  selectedFeatureIds,
  onToggleFeature,
  onSubmitSelected,
  isLoading,
}) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    // Mặc định mở rộng tất cả các ý để người dùng thẩm định chi tiết ngay
    const initial: Record<string, boolean> = {};
    features.forEach(f => {
      initial[f.id] = true;
    });
    return initial;
  });

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedCount = selectedFeatureIds.length;

  // Lấy màu và nhãn cho tỷ lệ phần trăm đáp ứng của hệ thống
  const getComplianceColor = (percent: number) => {
    if (percent >= 90) return { bar: '#10b981', badge: 'rgba(16, 185, 129, 0.2)', text: '#34d399' };
    if (percent >= 70) return { bar: '#06b6d4', badge: 'rgba(6, 182, 212, 0.2)', text: '#22d3ee' };
    if (percent >= 50) return { bar: '#f59e0b', badge: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24' };
    return { bar: '#ef4444', badge: 'rgba(239, 68, 68, 0.2)', text: '#f87171' };
  };

  return (
    <div className="consensus-board-card animate-fade-in">
      {/* Header Bảng Thống Nhất */}
      <div className="consensus-board-header">
        <div className="flex items-center gap-3">
          <div className="consensus-icon-wrap">
            <Layers className="text-cyan-400" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="consensus-pill-lead">TRANH LUẬN NẢY LỬA HOÀN TẤT</span>
              <span className="consensus-pill-sub">NHÂN VIÊN 1 (F&B) ⚡ NHÂN VIÊN 2 (TECH)</span>
            </div>
            <h3 className="consensus-title">BẢNG THỐNG NHẤT CHIẾN LƯỢC VẬN HÀNH & HỆ THỐNG PHẦN MỀM</h3>
            <p className="consensus-subtitle">
              Đối chiếu thực tế thị trường (McDonald's, Starbucks, Domino's, Toast POS, Square).
              <strong> Bạn vui lòng duyệt từng ý dưới đây để Nhân viên 3 (Senior Dev 30 năm KN) bắt đầu lập trình:</strong>
            </p>
          </div>
        </div>
        <div className="consensus-counter-pill">
          <span>Đã duyệt thực thi:</span>
          <strong>{selectedCount} / {features.length} ý</strong>
        </div>
      </div>

      {/* Danh sách các ý kiến chốt lại */}
      <div className="consensus-items-list">
        {features.map((item, index) => {
          const isSelected = selectedFeatureIds.includes(item.id);
          const isExpanded = !!expandedIds[item.id];
          const compliance = getComplianceColor(item.system_compliance_percent);

          return (
            <div
              key={item.id}
              className={`consensus-item-row ${isSelected ? 'row-selected' : ''}`}
            >
              {/* Thanh tiêu đề chính & Nút chọn duyệt */}
              <div className="consensus-item-main" onClick={() => onToggleFeature(item.id)}>
                <button
                  type="button"
                  className={`consensus-checkbox-btn ${isSelected ? 'checked' : ''}`}
                  onClick={e => {
                    e.stopPropagation();
                    onToggleFeature(item.id);
                  }}
                  title={isSelected ? 'Hủy duyệt ý này' : 'Duyệt ý này cho Nhân viên 3 thực thi'}
                >
                  {isSelected ? (
                    <CheckSquare size={22} className="text-cyan-400" />
                  ) : (
                    <Square size={22} className="text-slate-500 hover:text-slate-300" />
                  )}
                </button>

                <div className="consensus-item-info">
                  <div className="consensus-item-meta">
                    <span className="consensus-index">Ý #{index + 1}</span>
                    <span
                      className="consensus-badge compliance-badge"
                      style={{ backgroundColor: compliance.badge, color: compliance.text, borderColor: compliance.bar }}
                    >
                      <Percent size={11} /> Hệ thống đáp ứng: {item.system_compliance_percent}%
                    </span>
                    {isSelected ? (
                      <span className="consensus-badge approved-badge">
                        <CheckCircle size={11} /> ĐÃ DUYỆT THỰC THI CHO DEV 3
                      </span>
                    ) : (
                      <span className="consensus-badge pending-badge">
                        <HelpCircle size={11} /> CHƯA DUYỆT
                      </span>
                    )}
                  </div>

                  {/* Yêu cầu là gì */}
                  <div className="consensus-item-title-wrap">
                    <span className="consensus-req-prefix">YÊU CẦU:</span>
                    <h4 className="consensus-item-title">{item.requirement}</h4>
                  </div>

                  {/* Thanh hiển thị tiến độ % đáp ứng */}
                  <div className="compliance-bar-wrapper">
                    <div
                      className="compliance-bar-fill"
                      style={{
                        width: `${item.system_compliance_percent}%`,
                        backgroundColor: compliance.bar,
                      }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="consensus-expand-btn"
                  onClick={e => {
                    e.stopPropagation();
                    toggleExpand(item.id);
                  }}
                  title={isExpanded ? 'Thu gọn phân tích' : 'Xem chi tiết phản biện, rủi ro và giải pháp mềm'}
                >
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {/* Nội dung phân tích đa chiều mở rộng */}
              {isExpanded && (
                <div className="consensus-detail-drawer animate-fade-in">
                  {/* PHẦN 1: Phân tích Quy trình, Mặt Tích cực, Tiêu cực, Rủi ro */}
                  <div className="detail-section-title">
                    <Workflow size={15} className="text-amber-400" />
                    <span>1. PHÂN TÍCH QUY TRÌNH, MẶT TÍCH CỰC, TIÊU CỰC VÀ RỦI RO CỦA YÊU CẦU</span>
                  </div>

                  <div className="detail-grid">
                    <div className="detail-col process-box">
                      <div className="detail-col-title text-cyan-400">
                        <Cpu size={14} /> Phân Tích Quy Trình:
                      </div>
                      <p>{item.process_analysis}</p>
                    </div>

                    <div className="detail-col positive-box">
                      <div className="detail-col-title text-emerald-400">
                        <CheckCircle size={14} /> Mặt Tích Cực:
                      </div>
                      <p>{item.positives}</p>
                    </div>

                    <div className="detail-col negative-box">
                      <div className="detail-col-title text-rose-400">
                        <AlertTriangle size={14} /> Mặt Tiêu Cực & Hạn Chế:
                      </div>
                      <p>{item.negatives}</p>
                    </div>

                    <div className="detail-col risk-box">
                      <div className="detail-col-title text-amber-400">
                        <ShieldAlert size={14} /> Rủi Ro Của Yêu Cầu:
                      </div>
                      <p>{item.risks}</p>
                    </div>
                  </div>

                  {/* PHẦN 2: Thị trường bên ngoài đối tác & đối thủ */}
                  {item.market_case_studies && (
                    <div className="market-case-box">
                      <div className="market-case-header">
                        <Globe2 size={15} className="text-blue-400" />
                        <span className="font-semibold text-blue-300">
                          THỰC TẾ ĐỐI TÁC & ĐỐI THỦ THỊ TRƯỜNG (McD, Starbucks, Domino's, Toast POS, Square...):
                        </span>
                      </div>
                      <p className="market-case-text">{item.market_case_studies}</p>
                    </div>
                  )}

                  {/* PHẦN 3: Hệ thống đáp ứng gì vs Chưa đáp ứng & Giải pháp mềm */}
                  <div className="detail-section-title mt-3">
                    <Percent size={15} className="text-cyan-400" />
                    <span>2. NĂNG LỰC HỆ THỐNG VÀ GIẢI PHÁP CHO CÁC PHẦN CHƯA ĐÁP ỨNG</span>
                  </div>

                  <div className="compliance-analysis-grid">
                    <div className="comp-col supported-box">
                      <div className="comp-col-title text-emerald-400">
                        <CheckCircle size={14} /> Hệ Thống Đáp Ứng Được ({item.system_compliance_percent}%):
                      </div>
                      <p>{item.supported_features}</p>
                    </div>

                    <div className="comp-col gaps-box">
                      <div className="comp-col-title text-rose-400">
                        <AlertTriangle size={14} /> Hệ Thống Chưa Đáp Ứng Được:
                      </div>
                      <p>{item.unsupported_gaps}</p>
                    </div>

                    <div className="comp-col soft-solution-box">
                      <div className="comp-col-title text-purple-300">
                        <HelpCircle size={14} /> Giải Pháp Vận Hành Mềm (Quy trình SOP, Đào tạo nhân sự):
                      </div>
                      <p>{item.soft_solutions}</p>
                    </div>
                  </div>

                  {/* PHẦN 4: Cái cần thực thi giao cho Nhân viên 3 (Senior Dev 30 năm KN) */}
                  <div className="dev-task-dispatch-box">
                    <div className="dev-task-header">
                      <Code2 size={16} className="text-emerald-400" />
                      <span className="text-emerald-300 font-bold">
                        CÁI CẦN THỰC THI GIAO CHO NHÂN VIÊN 3 (SENIOR DEV 30 NĂM KN) KHI BẠN DUYỆT:
                      </span>
                    </div>
                    <p className="dev-task-content">{item.software_task_for_dev}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Thanh hành động chốt lại */}
      <div className="consensus-action-bar">
        <div className="consensus-action-hint">
          {selectedCount === 0 ? (
            <span className="text-amber-400">
              ⚠️ Vui lòng tích duyệt ít nhất 1 ý ở trên để Nhân viên 3 (Senior Dev) thực thi!
            </span>
          ) : (
            <span className="text-slate-300">
              Bạn đã duyệt <strong className="text-cyan-400">{selectedCount} ý tưởng</strong>. Sau khi bấm kích hoạt, Nhân viên 3 sẽ ngồi vào trạm lập trình viết Clean Code chuẩn OpenAPI.
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onSubmitSelected}
          disabled={isLoading || selectedCount === 0}
          className="consensus-submit-btn"
        >
          <Sparkles size={18} />
          <span>DUYỆT & GIAO CHO NHÂN VIÊN 3 (DEV 30 NĂM KN) THỰC THI ({selectedCount} Ý ĐÃ CHỌN)</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
