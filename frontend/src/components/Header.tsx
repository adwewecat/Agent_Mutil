import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Tv, Database, Terminal, Maximize2, Minimize2 } from 'lucide-react';

import { SystemHealth } from '../types';
import { soundFx } from '../office/soundEffects';

interface HeaderProps {
  health: SystemHealth | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
  onOpenStatusModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  soundEnabled,
  onToggleSound,
  scanlinesEnabled,
  onToggleScanlines,
  onOpenStatusModal,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  };

  return (
    <header className="header-container">
      <div className="header-brand">
        <div className="brand-logo-pixel">4D</div>
        <div>
          <h1 className="header-title">AGENT PIXELS • BỘ TỨ DŨNG</h1>
          <p className="header-subtitle">
            Hệ thống văn phòng ảo AI 40 năm kinh nghiệm • Software Director, Architect, Fullstack Dev & QA
          </p>
        </div>
      </div>

      <div className="header-actions">
        {/* Nút Toàn Màn Hình (Full Screen) */}
        <button
          onClick={toggleFullscreen}
          className={`control-btn ${isFullscreen ? 'active' : ''}`}
          title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Phóng to Toàn màn hình'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          <span>{isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
        </button>

        {/* Trạng thái Database */}
        <button
          onClick={onOpenStatusModal}
          className={`badge-btn ${health?.database_connected ? 'badge-online' : 'badge-offline'}`}
          title="Nhấn để xem chi tiết kết nối SQL Server"
        >
          <Database size={15} />
          <span>{health?.database_type || 'SQL Server'}</span>
          <span className="status-dot"></span>
        </button>

        {/* Nút bật/tắt âm thanh retro */}
        <button
          onClick={() => {
            soundFx.enabled = !soundEnabled;
            onToggleSound();
          }}
          className={`control-btn ${soundEnabled ? 'active' : ''}`}
          title={soundEnabled ? 'Tắt âm thanh retro 8-bit' : 'Bật âm thanh retro 8-bit'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span>8-Bit Sound</span>
        </button>

        {/* Nút bật/tắt hiệu ứng CRT Scanlines */}
        <button
          onClick={onToggleScanlines}
          className={`control-btn ${scanlinesEnabled ? 'active' : ''}`}
          title="Bật/Tắt hiệu ứng màn hình quét CRT Scanlines"
        >
          <Tv size={16} />
          <span>CRT Filter</span>
        </button>

        {/* Link tới OpenAPI Docs */}
        <a
          href="/docs"
          target="_blank"
          rel="noreferrer"
          className="control-btn docs-btn"
          title="Xem tài liệu OpenAPI Swagger trực quan"
        >
          <Terminal size={16} />
          <span>OpenAPI</span>
        </a>
      </div>
    </header>
  );
};
