import React from 'react';
import { Camera, Eye } from 'lucide-react';
import { CameraView } from '../types';

interface SecurityCameraBarProps {
  currentCamera: CameraView;
  onSelectCamera: (cam: CameraView) => void;
}

interface CamConfig {
  id: CameraView;
  code: string;
  name: string;
}

const CAMERAS: CamConfig[] = [
  { id: 'overview', code: 'CAM-TOWER', name: '🏢 Toàn Tháp AI' },
  { id: 'director_office' as CameraView, code: 'FLOOR-04', name: '👑 Tầng 4: Penthouse Giám Đốc (Dũng 1)' },
  { id: 'architect_office' as CameraView, code: 'FLOOR-03', name: '📐 Tầng 3: Bàn Tròn Kiến Trúc (Dũng 2)' },
  { id: 'boardroom', code: 'HOLO-NET', name: '🌐 Cầu Truyền Hình Hologram' },
  { id: 'dev_lab', code: 'FLOOR-02', name: '💻 Tầng 2: Cyber Dev Workshop (Dũng 3)' },
  { id: 'games_room' as CameraView, code: 'FLOOR-01', name: '🛡️ Tầng 1: QA Cyber Defense (Dũng 4)' },
  { id: 'kitchen_pantry' as CameraView, code: 'LOBBY-01', name: '☕ Sảnh Kính & Lounge Tầng 1' },
];


export const SecurityCameraBar: React.FC<SecurityCameraBarProps> = ({
  currentCamera,
  onSelectCamera,
}) => {
  return (
    <div className="camera-bar">
      <div className="camera-bar-title">
        <Camera size={16} className="text-cyan-400" />
        <span>GÓC QUAN SÁT CAMERA:</span>
      </div>

      <div className="camera-list">
        {CAMERAS.map(cam => {
          const isActive = currentCamera === cam.id;
          return (
            <button
              key={cam.id}
              onClick={() => onSelectCamera(cam.id)}
              className={`camera-btn ${isActive ? 'camera-btn-active' : ''}`}
            >
              <span className="cam-code">{cam.code}</span>
              <span className="cam-name">{cam.name}</span>
              {isActive && <Eye size={12} className="cam-active-icon" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
