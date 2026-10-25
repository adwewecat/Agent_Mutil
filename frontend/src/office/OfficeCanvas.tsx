import React, { useEffect, useRef } from 'react';
import { Agent, CameraView } from '../types';
import { OfficeEngine } from './engine';
import { OFFICE_WIDTH, OFFICE_HEIGHT } from './mapData';

interface OfficeCanvasProps {
  agents: Agent[];
  camera: CameraView;
  scanlinesEnabled: boolean;
  onAgentClick?: (agent: Agent) => void;
}

export const OfficeCanvas: React.FC<OfficeCanvasProps> = ({
  agents,
  camera,
  scanlinesEnabled,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<OfficeEngine | null>(null);

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

  // Cập nhật agents khi có dữ liệu mới
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setAgents(agents);
    }
  }, [agents]);

  // Cập nhật camera khi người dùng chuyển góc quay
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

  return (
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        width={OFFICE_WIDTH}
        height={OFFICE_HEIGHT}
        className="office-canvas"
      />
    </div>
  );
};
