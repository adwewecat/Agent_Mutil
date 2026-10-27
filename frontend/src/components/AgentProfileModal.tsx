import React from 'react';
import { Agent } from '../types';
import { X, Award, Briefcase, MapPin, Activity, Monitor, Users, Coffee, Sparkles } from 'lucide-react';

interface AgentProfileModalProps {
  agent: Agent | null;
  onClose: () => void;
  onDispatch: (code: string, room: string, status?: string) => void;
}

export const AgentProfileModal: React.FC<AgentProfileModalProps> = ({
  agent,
  onClose,
  onDispatch,
}) => {
  if (!agent) return null;

  const isFemale = agent.code === 'dung_2';
  const genderLabel = isFemale ? 'Nữ Chuyên Gia' : 'Nam Chuyên Gia';
  const genderIcon = isFemale ? '👩' : '👨';
  const themeColor = isFemale ? '#ec4899' : '#38bdf8';

  const roomNameMap: Record<string, string> = {
    director_office: 'Phòng Điều Hành / Bàn Tròn Hologram',
    architect_office: 'Trạm Kiến Trúc & Quản Lý Dự Án',
    dev_lab: 'Trạm Cyber Dev Lab',
    games_room: 'Trạm Kiểm Định QA & An Ninh',
    boardroom: 'Bàn Tròn Họp Dự Án Hologram 3D',
    kitchen_pantry: 'Sảnh Cafe & Ngắm Xe Bay',
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    idle: { label: 'Sẵn sàng nhận nhiệm vụ', color: '#38bdf8' },
    coding: { label: 'Đang lập trình Clean Code', color: '#10b981' },
    debating: { label: 'Đang họp & phản biện chiến lược', color: '#f59e0b' },
    testing: { label: 'Đang kiểm thử ma trận an ninh', color: '#ef4444' },
    moving: { label: 'Đang di chuyển trong văn phòng', color: '#a855f7' },
    resting: { label: 'Nghỉ giải lao / Thư giãn', color: '#ec4899' },
  };

  const currentStatusInfo = statusMap[agent.status] || { label: agent.status, color: '#38bdf8' };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: '580px', borderColor: themeColor }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ borderBottomColor: `${themeColor}40` }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{genderIcon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="modal-title" style={{ color: themeColor }}>
                  {agent.name}
                </h3>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${themeColor}20`,
                    color: themeColor,
                    border: `1px solid ${themeColor}60`,
                  }}
                >
                  {genderLabel}
                </span>
              </div>
              <p className="text-xs text-slate-400">{agent.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body space-y-4">
          {/* Avatar and Key Stats */}
          <div className="flex gap-4 p-3 bg-slate-900/80 rounded-lg border border-slate-800">
            <img
              src={`/assets/characters/${agent.code}.png`}
              alt={agent.name}
              className="w-20 h-20 rounded-lg object-cover border-2 shadow-lg"
              style={{ borderColor: themeColor }}
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <Award size={14} />
                <span>Kinh nghiệm: {agent.experience_years} năm chuyên sâu</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <MapPin size={14} className="text-cyan-400" />
                <span>Vị trí hiện tại: <strong>{roomNameMap[agent.current_room] || agent.current_room}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Activity size={14} style={{ color: currentStatusInfo.color }} />
                <span>Trạng thái: <strong style={{ color: currentStatusInfo.color }}>{currentStatusInfo.label}</strong></span>
              </div>
            </div>
          </div>

          {/* Specialty Description */}
          <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Briefcase size={13} className="text-indigo-400" />
              Năng lực chuyên môn cốt lõi
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {agent.specialty}
            </p>
          </div>

          {/* Quick Dispatch Controls */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles size={13} className="text-yellow-400" />
              Điều động nhân sự nhanh
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700 hover:border-cyan-500 transition-colors"
                onClick={() => {
                  let destRoom = 'dev_lab';
                  if (agent.code === 'dung_1') destRoom = 'director_office';
                  if (agent.code === 'dung_2') destRoom = 'architect_office';
                  if (agent.code === 'dung_3') destRoom = 'dev_lab';
                  onDispatch(agent.code, destRoom);
                  onClose();
                }}
              >
                <Monitor size={14} className="text-emerald-400" />
                Bàn làm việc
              </button>

              <button
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700 hover:border-amber-500 transition-colors"
                onClick={() => {
                  onDispatch(agent.code, 'boardroom', 'debating');
                  onClose();
                }}
              >
                <Users size={14} className="text-amber-400" />
                Vào Bàn họp
              </button>

              <button
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700 hover:border-pink-500 transition-colors"
                onClick={() => {
                  onDispatch(agent.code, 'kitchen_pantry', 'resting');
                  onClose();
                }}
              >
                <Coffee size={14} className="text-pink-400" />
                Sảnh Cafe / Đi dạo
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer flex items-center justify-between">
          <span className="text-[11px] text-slate-400 italic">
            *Bạn cũng có thể click trực tiếp lên sàn văn phòng để điều động nhân vật đi bộ.
          </span>
          <button onClick={onClose} className="btn-secondary text-xs px-4 py-1.5">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
