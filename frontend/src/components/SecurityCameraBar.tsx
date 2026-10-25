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
  { id: 'overview', code: 'CAM-01', name: 'Toàn cảnh' },
  { id: 'director_office' as CameraView, code: 'CAM-02', name: 'P. Giám Đốc (Dũng 1)' },
  { id: 'architect_office' as CameraView, code: 'CAM-03', name: 'P. Kiến Trúc (Dũng 2)' },
  { id: 'boardroom', code: 'CAM-04', name: 'Phòng Họp Tranh Luận' },
  { id: 'dev_lab', code: 'CAM-05', name: 'Dev Lab (Dũng 3)' },
  { id: 'games_room' as CameraView, code: 'CAM-06', name: 'Trạm QA & Security (Dũng 4)' },
  { id: 'kitchen_pantry' as CameraView, code: 'CAM-07', name: 'Cà Phê & Bếp Pantry' },
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
