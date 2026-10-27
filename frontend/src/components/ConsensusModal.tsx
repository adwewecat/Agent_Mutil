/**
 * Modal Popup hiển thị BẢNG THÔNG TIN CHỐT LẠI CỦA 4 DŨNG sau khi kết thúc vòng 1 tranh luận.
 * Tự động bật lên màn hình với âm thanh thông báo để người dùng nhận biết ngay lập tức.
 */

import React from 'react';
import { ConsensusFeatureItem } from '../types';
import { ConsensusBoard } from './ConsensusBoard';
import { X, Sparkles } from 'lucide-react';

interface ConsensusModalProps {
  isOpen: boolean;
  onClose: () => void;
  features: ConsensusFeatureItem[];
  selectedFeatureIds: string[];
  onToggleFeature: (featureId: string) => void;
  onSubmitSelected: () => void;
  isLoading: boolean;
}

export const ConsensusModal: React.FC<ConsensusModalProps> = ({
  isOpen,
  onClose,
  features,
  selectedFeatureIds,
  onToggleFeature,
  onSubmitSelected,
  isLoading,
}) => {
  if (!isOpen || features.length === 0) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="consensus-modal-wrapper" onClick={e => e.stopPropagation()}>
        {/* Banner thông báo tự động hoàn tất vòng 1 */}
        <div className="consensus-modal-alert-banner">
          <div className="flex items-center gap-2">
            <Sparkles className="text-cyan-400" size={18} />
            <span className="consensus-modal-tag">VÒNG 1 TRANH LUẬN HOÀN TẤT</span>
            <span className="consensus-modal-subtag">• CẢ 4 DŨNG ĐÃ THỐNG NHẤT CÁC PHƯƠNG ÁN</span>
          </div>
          <button className="consensus-modal-close-btn" onClick={onClose} title="Đóng cửa sổ">
            <X size={18} />
          </button>
        </div>

        {/* Nội dung bảng chốt lại */}
        <div className="consensus-modal-content">
          <ConsensusBoard
            features={features}
            selectedFeatureIds={selectedFeatureIds}
            onToggleFeature={onToggleFeature}
            onSubmitSelected={() => {
              onSubmitSelected();
              onClose();
            }}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
