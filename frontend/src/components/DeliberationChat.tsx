import React from 'react';
import { DeliberationMessage } from '../types';
import { MessageSquare, Code, ShieldCheck, Clock, UserCheck } from 'lucide-react';

interface DeliberationChatProps {
  messages: DeliberationMessage[];
  sessionTitle?: string;
  onViewCode: (code: string) => void;
  onViewTestMatrix: (matrix: string) => void;
}


export const DeliberationChat: React.FC<DeliberationChatProps> = ({
  messages,
  sessionTitle,
  onViewCode,
  onViewTestMatrix,
}) => {
  if (messages.length === 0) {
    return (
      <div className="chat-card empty-chat">
        <MessageSquare size={32} className="text-slate-500" />
        <h3>Chưa có phiên thảo luận nào được kích hoạt</h3>
        <p>Hãy nhập đề bài ở trên và nhấn "Kích hoạt toàn bộ quy trình" để theo dõi 4 Dũng làm việc trực tiếp.</p>
      </div>
    );
  }

  // Render format đơn giản cho Markdown
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="chat-heading">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={idx} className="font-bold text-slate-100">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="chat-quote">
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.startsWith('- ') || line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
        return (
          <div key={idx} className="chat-list-item">
            <span className="bullet">•</span>
            <span>{line.replace(/^[0-9]+\.\s+|^-\s+/, '')}</span>
          </div>
        );
      }
      return <p key={idx} className="chat-text-line">{line}</p>;
    });
  };

  return (
    <div className="chat-card">
      <div className="chat-card-header">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-indigo-400" />
          <h2 className="chat-title">
            DIỄN BIẾN TRANH LUẬN & HỘI ĐỒNG 4 DŨNG ({messages.length} BƯỚC)
            {sessionTitle ? ` • ${sessionTitle}` : ''}
          </h2>
        </div>
        <span className="chat-status-pill">
          <UserCheck size={14} /> Trực tiếp từ Boardroom
        </span>
      </div>


      <div className="messages-feed">
        {messages.map((msg, index) => {
          const isDung1 = msg.agent_code === 'dung_1';
          const isDung2 = msg.agent_code === 'dung_2';
          const isDung3 = msg.agent_code === 'dung_3';


          const color = isDung1
            ? '#3b82f6'
            : isDung2
            ? '#8b5cf6'
            : isDung3
            ? '#10b981'
            : '#ef4444';

          return (
            <div key={msg.id || index} className="message-item" style={{ borderLeftColor: color }}>
              <div className="message-meta-row">
                <div className="message-author-badge" style={{ backgroundColor: `${color}20`, color: color }}>
                  <span className="font-bold">{msg.agent_name}</span>
                </div>
                <div className="message-timestamp">
                  <Clock size={12} />
                  <span>{new Date(msg.timestamp).toLocaleTimeString('vi-VN')}</span>
                </div>
              </div>

              <div className="message-body">
                {renderFormattedContent(msg.content)}
              </div>

              {/* Nút xem Artifact nếu Dũng 3 gửi mã nguồn */}
              {msg.code_artifact && (
                <div className="artifact-banner">
                  <div className="artifact-info">
                    <Code size={18} className="text-emerald-400" />
                    <div>
                      <span className="artifact-title">Mã nguồn Clean Code do Dũng 3 hoàn thành</span>
                      <p className="artifact-sub">Đã tối ưu thuật toán, loại bỏ toàn bộ code dư thừa</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onViewCode(msg.code_artifact!)}
                    className="view-artifact-btn btn-code"
                  >
                    Xem Mã Nguồn Đầy Đủ
                  </button>
                </div>
              )}

              {/* Nút xem Ma trận test nếu Dũng 4 hoàn tất kiểm thử */}
              {msg.test_matrix && (
                <div className="artifact-banner test-banner">
                  <div className="artifact-info">
                    <ShieldCheck size={18} className="text-rose-400" />
                    <div>
                      <span className="artifact-title">Ma trận Test Cases & Security Audit của Dũng 4</span>
                      <p className="artifact-sub">Đạt 8/8 kịch bản (BVA, Stress Test, SQL Injection, XSS)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onViewTestMatrix(msg.test_matrix!)}
                    className="view-artifact-btn btn-test"
                  >
                    Xem Chi Tiết Ma Trận Test
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
