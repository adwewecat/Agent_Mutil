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
  { id: 'overview', code: 'CAM-CYBER', name: '🌐 Toàn Cảnh Cyber Office (16:9)' },
  { id: 'director_office' as CameraView, code: 'DIR-EXEC', name: '👑 Giám Đốc (Dũng 1)' },
  { id: 'architect_office' as CameraView, code: 'ARCH-HUD', name: '📐 Trạm Kiến Trúc (Dũng 2)' },
  { id: 'boardroom', code: 'HOLO-3D', name: '🔮 Bàn Tròn Họp Hologram 3D' },
  { id: 'dev_lab', code: 'DEV-LAB', name: '💻 Trạm Cyber Dev (Dũng 3)' },
  { id: 'games_room' as CameraView, code: 'QA-STRESS', name: '🛡️ Trạm QA & Test (Dũng 4)' },
  { id: 'kitchen_pantry' as CameraView, code: 'LOUNGE-SKY', name: '☕ Sảnh Cafe & Xe Bay' },
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
