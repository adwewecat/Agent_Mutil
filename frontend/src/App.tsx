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
import { AgentProfileModal } from './components/AgentProfileModal';
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
  const [isWaitingApproval, setIsWaitingApproval] = useState<boolean>(false);

  // Ref điều khiển Canvas trực tiếp
  const canvasRef = useRef<OfficeCanvasHandle | null>(null);

  // Trạng thái Modals
  const [activeCodeArtifact, setActiveCodeArtifact] = useState<string | null>(null);
  const [activeTestMatrix, setActiveTestMatrix] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [activeProfileAgent, setActiveProfileAgent] = useState<Agent | null>(null);

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
        if (sessions[0].status === 'waiting_approval') {
          setIsWaitingApproval(true);
        }
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
        dung_1: { x: 1000, y: 245 },  // Ghế Bắc: Phía trên bàn tròn (Dũng 1 - Nam Giám đốc)
        dung_2: { x: 810, y: 340 },   // Ghế Tây: Bên trái bàn tròn (Dũng 2 - Nữ Kiến trúc sư)
        dung_3: { x: 1000, y: 445 },  // Ghế Nam: Phía dưới bàn tròn (Dũng 3 - Nam Dev)
        dung_4: { x: 1190, y: 340 },  // Ghế Đông: Bên phải bàn tròn (Dũng 4 - Nữ QA)
      }[code] || { x: 1000, y: 340 },
      director_office: { x: 180, y: 205 }, // Bàn Giám Đốc Executive Suite (Nam)
      architect_office: { x: 340, y: 555 }, // Trạm Kiến Trúc & PM (Nữ)
      dev_lab: { x: 145, y: 555 }, // Trạm Cyber Dev Lab (Nam)
      games_room: { x: 535, y: 555 }, // Trạm QA & Test (Nữ)
      kitchen_pantry: { x: 960, y: 640 }, // Sảnh ngắm xe bay & cà phê
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
    setIsWaitingApproval(false);

    try {
      // Tạo session mới
      const session = await api.createSession(problem);
      setCurrentSession(session);

      if (step === 'full_cycle') {
        // HỦY BỎ NGHỈ GIẢI LAO VÀ GOM TOÀN BỘ 4 DŨNG VỀ BÀN HỌP TRÒN TRUNG TÂM KHI CÓ VẤN ĐỀ
        canvasRef.current?.cancelBreak();
        handleDispatchAgent('dung_1', 'boardroom', 'debating');
        handleDispatchAgent('dung_2', 'boardroom', 'debating');
        handleDispatchAgent('dung_3', 'boardroom', 'debating');
        handleDispatchAgent('dung_4', 'boardroom', 'debating');

        // ─────────────────────────────────────────────────────────────────────
        // GIAI ĐOẠN 1: DŨNG 1 (Software Director - Nghiên cứu thị trường & Rủi ro vận hành)
        // ─────────────────────────────────────────────────────────────────────
        setCurrentStageText('Giai đoạn 1: Cả 4 Dũng đã gom lại bàn họp! Dũng 1 (Software Director) phân tích thị trường & rủi ro vận hành...');
        setCamera('boardroom');
        soundFx.playAlert();

        // Gọi API lấy ý kiến Dũng 1
        const m1 = await api.triggerWorkflow(session.id, 'director');
        setMessages(m1);

        // Chờ 2.5 giây cho người dùng chứng kiến Dũng 1 phát biểu
        await sleep(2500);

        // ─────────────────────────────────────────────────────────────────────
        // GIAI ĐOẠN 2: DŨNG 2 (Software Architect & PM - 40 năm KN - Phản biện hệ thống & chốt kiến trúc)
        // ─────────────────────────────────────────────────────────────────────
        setCurrentStageText('Giai đoạn 2: Dũng 2 (40 năm KN) vào phòng họp phản biện rủi ro hệ thống & chốt kiến trúc...');
        soundFx.playAlert();

        // Dũng 2 rời phòng kiến trúc đi qua hành lang vào Boardroom ngồi cạnh Dũng 1
        handleDispatchAgent('dung_2', 'boardroom', 'debating');

        const m2 = await api.triggerWorkflow(session.id, 'architect');
        setMessages(prev => [...prev, ...m2]);

        // DỪNG LẠI CHỜ NGƯỜI DÙNG DUYỆT (Human-in-the-Loop Gate)
        setIsWaitingApproval(true);
        soundFx.playAlert();
        setCurrentStageText('⏸️ Dũng 1 & Dũng 2 đã chốt phương án! Đang chờ bạn phê duyệt để giao việc cho Dũng 3 & Dũng 4.');
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

  // 4. Xử lý người dùng PHÊ DUYỆT phương án -> Kích hoạt Dũng 3 và Dũng 4 thực thi
  const handleApproveWorkflow = async () => {
    if (!currentSession) return;
    setIsLoading(true);
    setIsWaitingApproval(false);

    try {
      // ─────────────────────────────────────────────────────────────────────
      // GIAI ĐOẠN 3: DŨNG 3 (Senior Fullstack Developer - 40 năm KN)
      // ─────────────────────────────────────────────────────────────────────
      setCurrentStageText('Giai đoạn 3: Đã phê duyệt! Dũng 3 vào Dev Lab ngồi vào bàn máy tính gõ phím viết Clean Code...');
      setCamera('dev_lab');
      soundFx.playType();

      // Dũng 3 đi vào Dev Lab ngồi vào ghế trước máy tính
      handleDispatchAgent('dung_3', 'dev_lab', 'coding');

      // Chờ 2.5 giây cho Dũng 3 di chuyển tới bàn và gõ phím
      await sleep(2500);

      const approvedMessages = await api.approveWorkflow(currentSession.id);
      // Lọc các tin nhắn mới (chỉ lấy stage developer và qa)
      const newMessages = approvedMessages.filter(m => m.stage === '3_developer' || m.stage === '4_qa');
      if (newMessages.length > 0) {
        setMessages(prev => [...prev, ...newMessages]);
      } else {
        setMessages(approvedMessages);
      }

      // ─────────────────────────────────────────────────────────────────────
      // GIAI ĐOẠN 4: DŨNG 4 (Test Engineer & Security Lead - 40 năm KN)
      // ─────────────────────────────────────────────────────────────────────
      setCurrentStageText('Giai đoạn 4: Dũng 4 lập ma trận Stress Test 5,000 req/s & Quét lỗ hổng an ninh...');
      setCamera('games_room');
      soundFx.playAlert();

      // Dũng 4 đi vào trạm kiểm thử cạnh bida
      handleDispatchAgent('dung_4', 'games_room', 'testing');

      // Chờ 2.5 giây biểu diễn test
      await sleep(2500);

      // Âm thanh hoàn thành xuất sắc
      soundFx.playSuccess();
      setCurrentStageText('✅ Hoàn thành 100%! Cả 4 Dũng đã hoàn tất xuất sắc toàn bộ quy trình được bạn phê duyệt!');
    } catch (err) {
      console.error('Lỗi khi phê duyệt workflow:', err);
      alert('Đã xảy ra lỗi kết nối khi phê duyệt quy trình.');
    } finally {
      setIsLoading(false);
    }
  };


  // Xử lý khi click vào Agent trên Canvas: Bật cửa sổ thông tin chi tiết và điều khiển
  const handleSelectAgentOnCanvas = (agent: Agent) => {
    setSelectedAgentCode(agent.code);
    canvasRef.current?.selectAgent(agent.code);
    setActiveProfileAgent(agent);
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
          isWaitingApproval={isWaitingApproval}
          onApproveWorkflow={handleApproveWorkflow}
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
                    setActiveProfileAgent(agent);
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

      {/* Modal hiển thị thông tin hồ sơ chi tiết và điều chỉnh Agent khi bấm vào nhân vật */}
      {activeProfileAgent && (
        <AgentProfileModal
          agent={activeProfileAgent}
          onClose={() => setActiveProfileAgent(null)}
          onDispatch={handleDispatchAgent}
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
