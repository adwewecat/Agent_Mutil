/**
 * Component hiển thị BẢNG THÔNG TIN CHỐT LẠI CUỐI CÙNG CỦA CẢ 4 DŨNG (Consensus Board).
 * Cho phép người dùng trực tiếp tích chọn từng dòng/ý nào nên phát triển phần mềm,
 * sau đó kích hoạt 4 Dũng tiếp tục tranh luận chuyên sâu về các mặt hạn chế và rủi ro của ý đó.
 */

import React, { useState } from 'react';
import { ConsensusFeatureItem } from '../types';
import {
  CheckSquare,
  Square,
  ShieldAlert,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
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
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedCount = selectedFeatureIds.length;

  return (
    <div className="consensus-board-card animate-fade-in">
      <div className="consensus-board-header">
        <div className="flex items-center gap-2">
          <div className="consensus-icon-wrap">
            <Layers className="text-cyan-400" size={20} />
          </div>
          <div>
            <h3 className="consensus-title">BẢNG THÔNG TIN CHỐT LẠI CỦA HỘI ĐỒNG 4 DŨNG</h3>
            <p className="consensus-subtitle">
              Sau vòng 1 tranh luận, cả 4 chuyên gia đã thống nhất bảng các ý tưởng giải pháp dưới đây.
              <strong> Hãy tích chọn các dòng Bạn muốn xây dựng phần mềm:</strong>
            </p>
          </div>
        </div>
        <div className="consensus-counter-pill">
          <span>Đã chọn:</span>
          <strong>{selectedCount} / {features.length} ý</strong>
        </div>
      </div>

      <div className="consensus-items-list">
        {features.map((item, index) => {
          const isSelected = selectedFeatureIds.includes(item.id);
          const isExpanded = !!expandedIds[item.id];

          return (
            <div
              key={item.id}
              className={`consensus-item-row ${isSelected ? 'row-selected' : ''}`}
            >
              {/* Cột chọn checkbox & Tiêu đề chính */}
              <div className="consensus-item-main" onClick={() => onToggleFeature(item.id)}>
                <button
                  type="button"
                  className={`consensus-checkbox-btn ${isSelected ? 'checked' : ''}`}
                  onClick={e => {
                    e.stopPropagation();
                    onToggleFeature(item.id);
                  }}
                  title={isSelected ? 'Bỏ chọn ý này' : 'Chọn phát triển phần mềm cho ý này'}
                >
                  {isSelected ? (
                    <CheckSquare size={20} className="text-cyan-400" />
                  ) : (
                    <Square size={20} className="text-slate-500 hover:text-slate-300" />
                  )}
                </button>

                <div className="consensus-item-info">
                  <div className="consensus-item-meta">
                    <span className="consensus-index">#{index + 1}</span>
                    <span className="consensus-badge category-badge">{item.category}</span>
                    <span className="consensus-badge proposer-badge">
                      <Cpu size={11} /> {item.proposer}
                    </span>
                    {item.software_recommended ? (
                      <span className="consensus-badge rec-software">
                        <CheckCircle2 size={11} /> Khuyến nghị: Làm phần mềm
                      </span>
                    ) : (
                      <span className="consensus-badge rec-manual">
                        <HelpCircle size={11} /> Khuyến nghị: Quy trình phi phần mềm
                      </span>
                    )}
                  </div>
                  <h4 className="consensus-item-title">{item.title}</h4>
                </div>

                <button
                  type="button"
                  className="consensus-expand-btn"
                  onClick={e => {
                    e.stopPropagation();
                    toggleExpand(item.id);
                  }}
                  title={isExpanded ? 'Thu gọn phân tích' : 'Xem chi tiết phản biện & rủi ro'}
                >
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              {/* Phần phân tích đa chiều mở rộng */}
              {isExpanded && (
                <div className="consensus-detail-drawer animate-fade-in">
                  <div className="detail-grid">
                    <div className="detail-col drawback-box">
                      <div className="detail-col-title text-rose-400">
                        <AlertTriangle size={14} /> Mặt Hạn Chế & Tiêu Cực:
                      </div>
                      <p>{item.drawbacks}</p>
                    </div>

                    <div className="detail-col counter-box">
                      <div className="detail-col-title text-emerald-400">
                        <CheckCircle2 size={14} /> Phản Biện & Cách Hóa Giải:
                      </div>
                      <p>{item.counter_arguments}</p>
                    </div>

                    <div className="detail-col cap-box">
                      <div className="detail-col-title text-cyan-400">
                        <Sparkles size={14} /> Đáp Ứng Được Gì:
                      </div>
                      <p>{item.capabilities}</p>
                    </div>

                    <div className="detail-col limit-box">
                      <div className="detail-col-title text-amber-400">
                        <ShieldAlert size={14} /> Không Đáp Ứng Gì & Rủi Ro Kỹ Thuật:
                      </div>
                      <p>
                        <strong>Giới hạn:</strong> {item.limitations}
                        <br />
                        <strong>Rủi ro:</strong> {item.technical_risks}
                      </p>
                    </div>
                  </div>

                  <div className="detail-reason-banner">
                    <span className="font-semibold text-slate-300">Đánh giá của 4 Dũng:</span>{' '}
                    <span>{item.recommendation_reason}</span>
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
            <span className="text-amber-400">⚠️ Vui lòng tích chọn ít nhất 1 ý tưởng để tiếp tục!</span>
          ) : (
            <span className="text-slate-300">
              Đã chọn <strong className="text-cyan-400">{selectedCount} ý</strong>. 4 Dũng sẽ ngồi lại phòng họp để mổ xẻ rủi ro và cam kết kỹ thuật trước khi code.
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
          <span>PHÁT TRIỂN PHẦN MỀM CHO CÁC Ý ĐÃ CHỌN ({selectedCount}) & TRANH LUẬN CHUYÊN SÂU</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
