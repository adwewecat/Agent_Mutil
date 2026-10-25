import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Agent, CameraView } from '../types';
import { OfficeEngine } from './engine';
import { OFFICE_WIDTH, OFFICE_HEIGHT } from './mapData';
import { MousePointerClick, Navigation } from 'lucide-react';

export interface OfficeCanvasHandle {
  moveAgent: (code: string, targetX: number, targetY: number, status?: string) => void;
  selectAgent: (code: string | null) => void;
}

interface OfficeCanvasProps {
  agents: Agent[];
  camera: CameraView;
  scanlinesEnabled: boolean;
  onSelectAgent?: (agent: Agent) => void;
  onAgentMoved?: (agent: Agent, target: { x: number; y: number }) => void;
}

export const OfficeCanvas = forwardRef<OfficeCanvasHandle, OfficeCanvasProps>(({
  agents,
  camera,
  scanlinesEnabled,
  onSelectAgent,
  onAgentMoved,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<OfficeEngine | null>(null);

  // Expose các phương thức điều khiển Canvas trực tiếp cho App cha
  useImperativeHandle(ref, () => ({
    moveAgent: (code: string, targetX: number, targetY: number, status?: string) => {
      if (engineRef.current) {
        engineRef.current.moveAgentTo(code, targetX, targetY, status);
      }
    },
    selectAgent: (code: string | null) => {
      if (engineRef.current) {
        engineRef.current.selectedAgentCode = code;
      }
    },
  }));

  // Khởi tạo Engine khi canvas mount
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new OfficeEngine(canvasRef.current);
    engine.showScanlines = scanlinesEnabled;
    engine.setAgents(agents);
    engine.setCamera(camera);
    engine.start();
    engineRef.current = engine;

    return () => {
      engine.stop();
    };
  }, []);

  // Cập nhật agents khi có dữ liệu mới (giữ nguyên vị trí đang bước đi)
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setAgents(agents);
    }
  }, [agents]);

  // Cập nhật camera khi chuyển góc quay
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setCamera(camera);
    }
  }, [camera]);

  // Cập nhật scanlines
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.showScanlines = scanlinesEnabled;
    }
  }, [scanlinesEnabled]);

  // Xử lý Click chuột trên Canvas
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!engineRef.current) return;
    const result = engineRef.current.handleCanvasClick(e.clientX, e.clientY);

    if (result.action === 'selected_agent' && result.agent) {
      onSelectAgent?.(result.agent);
    } else if (result.action === 'moved_agent' && result.agent && result.target) {
      onAgentMoved?.(result.agent, result.target);
    }
  };

  return (
    <div className="canvas-outer-card">
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={OFFICE_WIDTH}
          height={OFFICE_HEIGHT}
          onClick={handleClick}
          className="office-canvas interactive-canvas"
        />
      </div>

      {/* Thanh hướng dẫn tương tác chuột */}
      <div className="canvas-help-bar">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <MousePointerClick size={14} />
          <span className="font-semibold">Tương tác chuột trực tiếp:</span>
        </div>
        <span className="text-slate-300">
          Click chuột vào bất kỳ <strong>Dũng</strong> nào để chọn ➔ Sau đó click vào điểm bất kỳ trên sàn để ra lệnh đi bộ tới đó!
        </span>
        <div className="flex items-center gap-1 text-amber-400 ml-auto">
          <Navigation size={12} />
          <span>Click phòng để Zoom Camera</span>
        </div>
      </div>
    </div>
  );
});
