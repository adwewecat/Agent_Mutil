import React from 'react';
import { Agent } from '../types';
import { Award, MapPin } from 'lucide-react';


interface AgentCardProps {
  agent: Agent;
  onDispatch: (code: string, room: string) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onDispatch }) => {
  // Trạng thái hiển thị tiếng Việt
  const statusLabels: Record<string, { text: string; color: string }> = {
    idle: { text: 'Nghỉ ngơi', color: '#94a3b8' },
    moving: { text: 'Đang di chuyển', color: '#38bdf8' },
    debating: { text: 'Đang tranh luận', color: '#f59e0b' },
    coding: { text: 'Đang viết Code', color: '#10b981' },
    testing: { text: 'Đang Stress Test', color: '#ef4444' },
    resting: { text: 'Thư giãn Lounge', color: '#a855f7' },
  };

  const statusInfo = statusLabels[agent.status] || { text: agent.status, color: '#94a3b8' };

  return (
    <div className="agent-card" style={{ borderTop: `4px solid ${agent.avatar_color}` }}>
      <div className="agent-card-header">
        <div className="agent-avatar" style={{ border: `2px solid ${agent.avatar_color}` }}>
          <img
            src={`/assets/characters/${agent.code}.png`}
            alt={agent.name}
            className="agent-avatar-img"
          />
        </div>
        <div className="agent-info">
          <h3 className="agent-name">{agent.name}</h3>
          <p className="agent-role">{agent.role}</p>
        </div>
      </div>

      <div className="agent-badge-row">
        <span className="exp-badge">
          <Award size={12} />
          <span>{agent.experience_years} năm kinh nghiệm</span>
        </span>
        <span
          className="agent-status-badge"
          style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}
        >
          <span className="dot" style={{ backgroundColor: statusInfo.color }}></span>
          {statusInfo.text}
        </span>
      </div>

      <p className="agent-specialty">{agent.specialty}</p>

      {/* Nút điều động nhanh */}
      <div className="agent-dispatch-bar">
        <span className="dispatch-title">
          <MapPin size={12} /> Điều động:
        </span>
        <button
          onClick={() => onDispatch(agent.code, 'boardroom')}
          className="dispatch-chip chip-boardroom"
          title="Gọi vào phòng họp tranh luận"
        >
          Họp
        </button>
        <button
          onClick={() =>
            onDispatch(
              agent.code,
              agent.code === 'dung_1'
                ? 'director_office'
                : agent.code === 'dung_2'
                ? 'architect_office'
                : agent.code === 'dung_3'
                ? 'dev_lab'
                : 'games_room'
            )
          }
          className="dispatch-chip"
          title="Về phòng làm việc chuyên môn"
        >
          Bàn làm việc
        </button>
        <button
          onClick={() => onDispatch(agent.code, 'games_room')}
          className="dispatch-chip"
          title="Đến trạm kiểm thử QA & Security"
        >
          QA Lab
        </button>
        <button
          onClick={() => onDispatch(agent.code, 'kitchen_pantry')}
          className="dispatch-chip"
          title="Ra quầy pantry uống nước / cà phê"
        >
          Pantry
        </button>
      </div>
    </div>
  );
};

