/**
 * Component trung tâm kết nối toàn bộ hệ thống Virtual Pixel Office và 4 Dũng
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Agent, CameraView, DeliberationMessage, ProjectSession, SystemHealth } from './types';
import { api } from './services/api';
import { Header } from './components/Header';
import { SecurityCameraBar } from './components/SecurityCameraBar';
import { OfficeCanvas, OfficeCanvasHandle } from './office/OfficeCanvas';
import { AgentCard } from './components/AgentCard';
import { WorkflowPanel } from './components/WorkflowPanel';
import { DeliberationChat } from './components/DeliberationChat';
import { CodeArtifactViewer } from './components/CodeArtifactViewer';
import { TestMatrixModal } from './components/TestMatrixModal';
import { SystemStatusModal } from './components/SystemStatusModal';
import { soundFx } from './office/soundEffects';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const App: React.FC = () => {
  // Trạng thái dữ liệu
  const [agents, setAgents] = useState<Agent[]>([]);
  const [currentSession, setCurrentSession] = useState<ProjectSession | null>(null);
  const [messages, setMessages] = useState<DeliberationMessage[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);

  // Trạng thái UI & Camera
  const [camera, setCamera] = useState<CameraView>('overview');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStageText, setCurrentStageText] = useState<string>('');
  const [selectedAgentCode, setSelectedAgentCode] = useState<string | null>(null);

  // Ref điều khiển Canvas trực tiếp
  const canvasRef = useRef<OfficeCanvasHandle | null>(null);

  // Trạng thái Modals
  const [activeCodeArtifact, setActiveCodeArtifact] = useState<string | null>(null);
  const [activeTestMatrix, setActiveTestMatrix] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);

  // 1. Nạp dữ liệu ban đầu khi mở ứng dụng
  const loadInitialData = useCallback(async () => {
    try {
      const agentsData = await api.getAgents();
      setAgents(agentsData);

      const healthData = await api.getHealth();
      setHealth(healthData);

      const sessions = await api.getSessions();
      if (sessions.length > 0) {
        setCurrentSession(sessions[0]);
        setMessages(sessions[0].messages || []);
      }
    } catch (err) {
      console.warn('Lỗi khi tải dữ liệu ban đầu:', err);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // 2. Xử lý điều động Agent sang phòng làm việc (Đã căn chuẩn tọa độ ghế ngồi, tuyệt đối không trèo lên bàn)
  const handleDispatchAgent = (code: string, room: string, statusOverride?: string) => {
    const targetCoords: Record<string, { x: number; y: number }> = {
      boardroom: {
        dung_1: { x: 445, y: 350 }, // Ghế họp dãy trên bên trái (bàn che nửa thân dưới)
        dung_2: { x: 525, y: 350 }, // Ghế họp dãy trên bên phải
        dung_3: { x: 445, y: 435 }, // Ghế họp dãy dưới
        dung_4: { x: 525, y: 435 }, // Ghế họp dãy dưới
      }[code] || { x: 445, y: 350 },
      director_office: { x: 470, y: 130 },   // Ngồi ghế sofa da đỏ tiếp khách
      architect_office: { x: 125, y: 195 }, // Ngồi ghế xoay trước bàn thiết kế
      dev_lab: { x: 135, y: 410 },          // Ngồi ghế văn phòng trước máy tính Dev Lab
      games_room: { x: 710, y: 405 },       // Đứng cạnh bàn bida (tay cầm gậy cơ)
      kitchen_pantry: { x: 740, y: 165 },   // Đứng trước quầy bar cà phê
    };

    const target = targetCoords[room] || { x: 500, y: 250 };
    const newStatus = statusOverride || 'moving';

    // Điều động Canvas ngay lập tức
    canvasRef.current?.moveAgent(code, target.x, target.y, newStatus);

    // Cập nhật state nội bộ
    setAgents(prev =>
      prev.map(a =>
        a.code === code
          ? {
              ...a,
              target_x: target.x,
              target_y: target.y,
              current_room: room,
              status: newStatus as Agent['status'],
            }
          : a
      )
    );

    soundFx.playCameraSwitch();

    // Gửi API cập nhật cơ sở dữ liệu ngầm
    api.moveAgent(code, room).catch(e => console.warn('Lỗi lưu DB:', e));
  };

  // 3. Xử lý kích hoạt chu trình làm việc 4 Dũng (Chạy tuần tự sống động có thời gian di chuyển & biểu diễn thực)
  const handleRunWorkflow = async (problem: string, step: string) => {
    setIsLoading(true);

    try {
      // Tạo session mới
      const session = await api.createSession(problem);
      setCurrentSession(session);

      if (step === 'full_cycle') {
        // ─────────────────────────────────────────────────────────────────────
        // GIAI ĐOẠN 1: DŨNG 1 (Software Director)
        // ─────────────────────────────────────────────────────────────────────
        setCurrentStageText('Giai đoạn 1: Dũng 1 (Software Director) tiếp nhận bài toán và bước vào phòng họp...');
        setCamera('boardroom');
        soundFx.playAlert();

        // Dũng 1 đi vào ghế họp Boardroom dãy trên
        handleDispatchAgent('dung_1', 'boardroom', 'debating');

        // Gọi API lấy ý kiến Dũng 1
        const m1 = await api.triggerWorkflow(session.id, 'director');
        setMessages(m1);

        // Chờ 2.5 giây cho người dùng chứng kiến Dũng 1 đi vào và phát biểu
        await sleep(2500);

        // ─────────────────────────────────────────────────────────────────────
        // GIAI ĐOẠN 2: DŨNG 2 (Software Architect & PM - 40 năm KN)
        // ─────────────────────────────────────────────────────────────────────
        setCurrentStageText('Giai đoạn 2: Dũng 2 (40 năm KN) vào phòng họp phản biện kiến trúc & thẩm định rủi ro...');
        soundFx.playAlert();

        // Dũng 2 rời phòng kiến trúc đi qua hành lang vào Boardroom ngồi cạnh Dũng 1
        handleDispatchAgent('dung_2', 'boardroom', 'debating');

        const m2 = await api.triggerWorkflow(session.id, 'architect');
        setMessages(prev => [...prev, ...m2]);

        // Chờ 3 giây để hai Dũng cùng ngồi họp bàn tròn tranh luận
        await sleep(3000);

        // ─────────────────────────────────────────────────────────────────────
        // GIAI ĐOẠN 3: DŨNG 3 (Senior Fullstack Developer - 40 năm KN)
        // ─────────────────────────────────────────────────────────────────────
        setCurrentStageText('Giai đoạn 3: Dũng 3 vào Dev Lab ngồi vào ghế gõ phím viết Clean Code chuẩn xác...');
        setCamera('dev_lab');
        soundFx.playType();

        // Dũng 3 đi vào Dev Lab ngồi vào ghế trước máy tính
        handleDispatchAgent('dung_3', 'dev_lab', 'coding');

        const m3 = await api.triggerWorkflow(session.id, 'developer');
        setMessages(prev => [...prev, ...m3]);

        // Chờ 3 giây cho người dùng thấy Dũng 3 gõ code với tiếng phím
        await sleep(3000);

        // ─────────────────────────────────────────────────────────────────────
        // GIAI ĐOẠN 4: DŨNG 4 (Test Engineer & Security Lead - 40 năm KN)
        // ─────────────────────────────────────────────────────────────────────
        setCurrentStageText('Giai đoạn 4: Dũng 4 lập ma trận Stress Test 5,000 req/s & Quét lỗ hổng an ninh...');
        setCamera('games_room');
        soundFx.playAlert();

        // Dũng 4 đi vào trạm kiểm thử cạnh bida
        handleDispatchAgent('dung_4', 'games_room', 'testing');

        const m4 = await api.triggerWorkflow(session.id, 'qa');
        setMessages(prev => [...prev, ...m4]);

        // Âm thanh hoàn thành xuất sắc
        soundFx.playSuccess();
        setCurrentStageText('✅ Hoàn thành 100%! Cả 4 Dũng đã hoàn tất xuất sắc nhiệm vụ!');
      } else {
        // Thực thi từng bước đơn lẻ
        setCurrentStageText(`Đang thực thi: ${step.toUpperCase()}`);
        const resMessages = await api.triggerWorkflow(session.id, step);
        setMessages(prev => [...prev, ...resMessages]);

        if (step === 'director') {
          handleDispatchAgent('dung_1', 'boardroom', 'debating');
          setCamera('boardroom');
        } else if (step === 'architect') {
          handleDispatchAgent('dung_2', 'boardroom', 'debating');
          setCamera('boardroom');
        } else if (step === 'developer') {
          handleDispatchAgent('dung_3', 'dev_lab', 'coding');
          setCamera('dev_lab');
        } else if (step === 'qa') {
          handleDispatchAgent('dung_4', 'games_room', 'testing');
          setCamera('games_room');
        }
      }
    } catch (err) {
      console.error('Lỗi khi chạy workflow:', err);
      alert('Đã xảy ra lỗi kết nối khi thực thi quy trình.');
    } finally {
      setIsLoading(false);
    }
  };


  // Xử lý khi click vào Agent trên Canvas
  const handleSelectAgentOnCanvas = (agent: Agent) => {
    setSelectedAgentCode(agent.code);
    canvasRef.current?.selectAgent(agent.code);
  };

  // Xử lý khi click điều động Agent tới tọa độ sàn mới
  const handleAgentMovedOnCanvas = (agent: Agent, target: { x: number; y: number }) => {
    setAgents(prev =>
      prev.map(a =>
        a.code === agent.code
          ? { ...a, target_x: target.x, target_y: target.y, status: 'moving' }
          : a
      )
    );
  };

  return (
    <div className="app-layout">
      {/* Header thanh điều khiển */}
      <Header
        health={health}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        scanlinesEnabled={scanlinesEnabled}
        onToggleScanlines={() => setScanlinesEnabled(prev => !prev)}
        onOpenStatusModal={() => setShowStatusModal(true)}
      />

      <main className="main-content">
        {/* 1. GIAO ĐỀ BÀI CHO BỘ TỨ DŨNG - ĐẶT Ở TRÊN CÙNG THEO YÊU CẦU */}
        <WorkflowPanel
          onRunWorkflow={handleRunWorkflow}
          isLoading={isLoading}
          currentStage={currentStageText}
        />

        {/* 2. BỐ CỤC 2 CỘT CHÍNH: BÊN TRÁI (VĂN PHÒNG & CAMERA & CHAT) - BÊN PHẢI (4 DŨNG XẾP DỌC) */}
        <div className="workspace-split-layout">
          {/* CỘT BÊN TRÁI: Camera giám sát, Canvas Pixel Office 2.5D, Tiến trình tranh luận */}
          <div className="left-stage-column">
            {/* Thanh chuyển đổi góc quay camera an ninh */}
            <SecurityCameraBar currentCamera={camera} onSelectCamera={setCamera} />

            {/* Khung Canvas Game Engine 2.5D Isometric mô phỏng văn phòng ảo Pixel Office */}
            <OfficeCanvas
              ref={canvasRef}
              agents={agents}
              camera={camera}
              scanlinesEnabled={scanlinesEnabled}
              onSelectAgent={handleSelectAgentOnCanvas}
              onAgentMoved={handleAgentMovedOnCanvas}
            />

            {/* Nhật ký tranh luận và sản phẩm bàn giao của 4 Dũng */}
            <DeliberationChat
              messages={messages}
              sessionTitle={currentSession?.title}
              onViewCode={code => setActiveCodeArtifact(code)}
              onViewTestMatrix={matrix => setActiveTestMatrix(matrix)}
            />
          </div>

          {/* CỘT BÊN PHẢI: BỘ TỨ DŨNG THEO CHIỀU DỌC ĐỂ DỄ NHÌN, LẤP ĐẦY KHOẢNG TRỐNG */}
          <aside className="right-agents-sidebar">
            <div className="sidebar-sticky-header">
              <div className="flex items-center justify-between">
                <span className="sidebar-badge-title">👥 BỘ TỨ DŨNG AI</span>
                <span className="status-live-indicator">TRỰC BAN</span>
              </div>
              <p className="sidebar-desc">
                Nhấn "Họp", "Bàn làm việc", "Bida", "Pantry" hoặc click trực tiếp lên sàn để điều động nhân vật đi bộ!
              </p>
            </div>

            <div className="agents-vertical-list">
              {agents.map(agent => (
                <div
                  key={agent.id || agent.code}
                  onClick={() => {
                    setSelectedAgentCode(agent.code);
                    canvasRef.current?.selectAgent(agent.code);
                  }}
                  className={`agent-card-wrapper ${selectedAgentCode === agent.code ? 'selected-card-glow' : ''}`}
                >
                  <AgentCard
                    agent={agent}
                    onDispatch={handleDispatchAgent}
                  />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      {/* Modal hiển thị mã nguồn Clean Code của Dũng 3 */}
      {activeCodeArtifact && (
        <CodeArtifactViewer
          code={activeCodeArtifact}
          onClose={() => setActiveCodeArtifact(null)}
        />
      )}

      {/* Modal hiển thị ma trận kiểm thử của Dũng 4 */}
      {activeTestMatrix && (
        <TestMatrixModal
          matrix={activeTestMatrix}
          onClose={() => setActiveTestMatrix(null)}
        />
      )}

      {/* Modal hiển thị tình trạng hệ thống SQL Server / FastAPI */}
      {showStatusModal && (
        <SystemStatusModal
          health={health}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </div>
  );
};
