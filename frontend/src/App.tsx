/**
 * Component trung tâm kết nối toàn bộ hệ thống Virtual Pixel Office và 4 Dũng
 * Triển khai chu trình 5 giai đoạn kèm HOẠT ẢNH TRÊN ĐẦU NHÂN VẬT & TỰ ĐỘNG BẬT POPUP:
 * 1. Hội đồng 4 Dũng ngồi vào Boardroom: Lần lượt xuất hiện bong bóng sóng âm thoại trên đầu từng Dũng.
 * 2. VÒNG 1 XONG -> TỰ ĐỘNG BẬT POPUP BẢNG CHỐT LẠI (ConsensusModal) để người dùng chọn ý phần mềm.
 * 3. Người dùng chọn xong -> 4 Dũng tiếp tục tranh luận chuyên sâu về hạn chế & rủi ro trên Canvas.
 * 4. Cả 4 Dũng về bàn làm việc riêng: Dũng 3 gõ code, Dũng 4 chạy test.
 * 5. Bàn giao kết quả -> Cả 4 Dũng lại ngồi vào Boardroom lần 2 -> TỰ ĐỘNG BẬT POPUP NGHIỆM THU (FinalReviewModal).
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Agent, CameraView, DeliberationMessage, ProjectSession, SystemHealth, ConsensusFeatureItem } from './types';
import { api } from './services/api';
import { Header } from './components/Header';
import { SecurityCameraBar } from './components/SecurityCameraBar';
import { OfficeCanvas, OfficeCanvasHandle } from './office/OfficeCanvas';
import { AgentCard } from './components/AgentCard';
import { WorkflowPanel } from './components/WorkflowPanel';
import { ConsensusBoard } from './components/ConsensusBoard';
import { ConsensusModal } from './components/ConsensusModal';
import { FinalReviewModal } from './components/FinalReviewModal';
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

  // Trạng thái quy trình 5 giai đoạn
  const [consensusFeatures, setConsensusFeatures] = useState<ConsensusFeatureItem[]>([]);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [workflowStage, setWorkflowStage] = useState<'initial' | 'waiting_feature_selection' | 'ready_for_workstations' | 'finished'>('initial');

  // Trạng thái tự động bật Popups
  const [showConsensusModal, setShowConsensusModal] = useState<boolean>(false);
  const [showFinalReviewModal, setShowFinalReviewModal] = useState<boolean>(false);

  // Trạng thái UI & Camera
  const [camera, setCamera] = useState<CameraView>('overview');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStageText, setCurrentStageText] = useState<string>('');
  const [selectedAgentCode, setSelectedAgentCode] = useState<string | null>(null);

  // Ref điều khiển Canvas trực tiếp
  const canvasRef = useRef<OfficeCanvasHandle | null>(null);

  // Trạng thái Modals khác
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
        const lastSession = sessions[0];
        setCurrentSession(lastSession);
        setMessages(lastSession.messages || []);

        if (lastSession.consensus_features) {
          try {
            const parsed = JSON.parse(lastSession.consensus_features);
            setConsensusFeatures(parsed);
          } catch (e) {
            console.warn('Lỗi parse consensus_features:', e);
          }
        }
        if (lastSession.selected_features) {
          try {
            const parsedSel = JSON.parse(lastSession.selected_features);
            setSelectedFeatureIds(parsedSel);
          } catch (e) {
            console.warn('Lỗi parse selected_features:', e);
          }
        }

        if (lastSession.status === 'waiting_feature_selection') {
          setWorkflowStage('waiting_feature_selection');
          setShowConsensusModal(true);
        } else if (lastSession.status === 'ready_for_workstations') {
          setWorkflowStage('ready_for_workstations');
        } else if (lastSession.status === 'completed') {
          setWorkflowStage('finished');
        }
      }
    } catch (err) {
      console.warn('Lỗi khi tải dữ liệu ban đầu:', err);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // 2. Xử lý điều động Agent sang phòng làm việc
  const handleDispatchAgent = (code: string, room: string, statusOverride?: string) => {
    const targetCoords: Record<string, { x: number; y: number }> = {
      boardroom: {
        dung_1: { x: 1000, y: 275 },  // Ghế Bắc: Phía trên bàn tròn (Dũng 1 - Nam Giám đốc)
        dung_2: { x: 850, y: 340 },   // Ghế Tây: Bên trái bàn tròn (Dũng 2 - Nữ Kiến trúc sư)
        dung_3: { x: 1000, y: 420 },  // Ghế Nam: Phía dưới bàn tròn (Dũng 3 - Nam Dev)
        dung_4: { x: 1150, y: 340 },  // Ghế Đông: Bên phải bàn tròn (Dũng 4 - Nữ QA)
      }[code] || { x: 1000, y: 340 },
      director_office: { x: 230, y: 260 }, // Bàn Giám Đốc Executive Suite (Nam)
      architect_office: { x: 385, y: 620 }, // Trạm Kiến Trúc & PM (Nữ)
      dev_lab: { x: 185, y: 620 }, // Trạm Cyber Dev Lab (Nam)
      games_room: { x: 585, y: 620 }, // Trạm QA & Test (Nữ)
      kitchen_pantry: { x: 980, y: 650 }, // Sảnh ngắm xe bay & cà phê
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

  // 3. GIAI ĐOẠN 1: HỌP KHỞI ĐẦU & TRANH LUẬN ĐA CHIỀU 4 DŨNG (KÈM HOẠT ẢNH TRÊN ĐẦU & BẬT POPUP XONG)
  const handleRunWorkflow = async (problem: string, _step: string) => {
    setIsLoading(true);
    setShowFinalReviewModal(false);
    setShowConsensusModal(false);
    setConsensusFeatures([]);
    setSelectedFeatureIds([]);

    try {
      const session = await api.createSession(problem);
      setCurrentSession(session);

      // HỦY BỎ NGHỈ GIẢI LAO VÀ GOM TOÀN BỘ 4 DŨNG VỀ BÀN HỌP TRÒN TRUNG TÂM KHI CÓ VẤN ĐỀ
      canvasRef.current?.cancelBreak();
      handleDispatchAgent('dung_1', 'boardroom', 'debating');
      handleDispatchAgent('dung_2', 'boardroom', 'debating');
      handleDispatchAgent('dung_3', 'boardroom', 'debating');
      handleDispatchAgent('dung_4', 'boardroom', 'debating');

      setCamera('boardroom');
      soundFx.playAlert();
      setCurrentStageText('Giai đoạn 1: 4 Dũng đang ngồi họp bàn tròn Hologram 3D, tranh luận phản biện mặt hạn chế...');

      // Diễn hoạt luân phiên bong bóng thoại trên đầu 4 Dũng sống động
      canvasRef.current?.setCustomBubble('dung_1', '🗣️ Phân tích thị trường & Rủi ro vận hành...', 3200);
      await sleep(1500);

      canvasRef.current?.setCustomBubble('dung_2', '⚡ Phản biện rủi ro hệ thống & Kiến trúc HMAC...', 3200);
      await sleep(1500);

      canvasRef.current?.setCustomBubble('dung_3', '💻 Khả thi PWA & Cơ chế Idempotency Key...', 3200);
      await sleep(1500);

      canvasRef.current?.setCustomBubble('dung_4', '🛡️ Cảnh báo hack QR, ghost orders & Test 5K TPS...', 3200);
      await sleep(1500);

      // Kích hoạt Vòng 1 tranh luận trên Backend
      const newMsgs = await api.triggerWorkflow(session.id, 'initial_deliberation');
      setMessages(newMsgs);

      // Lấy Bảng Thông Tin Chốt Lại
      const features = await api.getConsensusFeatures(session.id);
      setConsensusFeatures(features);

      // Mặc định chọn các ý được hội đồng khuyến nghị làm phần mềm
      const recIds = features.filter(f => f.software_recommended).map(f => f.id);
      setSelectedFeatureIds(recIds.length > 0 ? recIds : features.map(f => f.id));

      setWorkflowStage('waiting_feature_selection');
      soundFx.playAlert();
      setCurrentStageText('Giai đoạn 2: Bảng thông tin chốt lại đã sẵn sàng! Popup đã hiện lên để bạn chọn các ý phần mềm.');

      // TỰ ĐỘNG BẬT POPUP CHỌN TÍNH NĂNG ĐỂ NGƯỜI DÙNG BIẾT NGAY!
      setShowConsensusModal(true);
    } catch (err) {
      console.error('Lỗi khi chạy workflow:', err);
      alert('Đã xảy ra lỗi kết nối khi thực thi quy trình.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Xử lý tích chọn hoặc bỏ chọn tính năng trong Bảng Chốt Lại
  const handleToggleFeature = (id: string) => {
    setSelectedFeatureIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // 5. GIAI ĐOẠN 3: PHÂN TÍCH CHUYÊN SÂU CHO CÁC Ý NGƯỜI DÙNG CHỌN NGAY TẠI PHÒNG HỌP
  const handleSelectFeaturesAndDeepDive = async () => {
    if (!currentSession || selectedFeatureIds.length === 0) return;
    setIsLoading(true);
    setShowConsensusModal(false);

    try {
      setCamera('boardroom');
      soundFx.playType();
      setCurrentStageText('Giai đoạn 3: 4 Dũng đang tự nói chuyện, tranh luận chuyên sâu về các mặt hạn chế & rủi ro của các ý bạn chọn...');

      // Hoạt ảnh bong bóng thoại trên đầu Dũng 1, Dũng 2, Dũng 3 khi mổ xẻ rủi ro
      canvasRef.current?.setCustomBubble('dung_2', '🔍 Mổ xẻ mặt hạn chế & rủi ro của các ý bạn đã chọn...', 3000);
      await sleep(1500);
      canvasRef.current?.setCustomBubble('dung_3', '🛠️ Chốt cam kết Clean Code & Ma trận Test 8 kịch bản...', 3000);

      const deepDiveMsgs = await api.selectFeaturesAndDeepDive(currentSession.id, selectedFeatureIds);
      setMessages(prev => [...prev, ...deepDiveMsgs]);

      setWorkflowStage('ready_for_workstations');
      soundFx.playAlert();
      setCurrentStageText('Đã chốt phân tích chuyên sâu! Bấm nút "Lệnh cho cả 4 Dũng về bàn làm việc" ở trên để thực thi.');
    } catch (err) {
      console.error('Lỗi khi gửi lựa chọn tính năng:', err);
      alert('Đã xảy ra lỗi khi gửi lựa chọn tính năng.');
    } finally {
      setIsLoading(false);
    }
  };

  // 6. GIAI ĐOẠN 4 & 5: VỀ BÀN LÀM VIỆC THỰC THI & HỌP BOARDROOM LẦN 2 (KÈM POPUP TỔNG KẾT)
  const handleExecuteWorkstations = async () => {
    if (!currentSession) return;
    setIsLoading(true);

    try {
      // Giai đoạn 4: Cả 4 Dũng đều về bàn làm việc riêng của mình
      setCurrentStageText('Giai đoạn 4: Cả 4 Dũng về bàn làm việc: Dũng 3 viết Clean Code, Dũng 4 chạy Stress Test 5,000 TPS...');
      handleDispatchAgent('dung_1', 'director_office', 'idle');
      handleDispatchAgent('dung_2', 'architect_office', 'idle');
      handleDispatchAgent('dung_3', 'dev_lab', 'coding');
      handleDispatchAgent('dung_4', 'games_room', 'testing');

      setCamera('dev_lab');
      soundFx.playType();

      // Hoạt ảnh gõ code trên đầu Dũng 3
      canvasRef.current?.setCustomBubble('dung_3', '⚡ Đang gõ phím Clean Code: FastAPI Async...', 3000);

      // Chờ 2.5s mô phỏng gõ phím ở Dev Lab
      await sleep(2500);

      // Chuyển camera sang trạm QA Lab
      setCamera('games_room');
      soundFx.playAlert();

      // Hoạt ảnh bắn phá test trên đầu Dũng 4
      canvasRef.current?.setCustomBubble('dung_4', '🎯 Đang bắn phá: 8 Kịch bản Stress Test 5,000 TPS...', 3000);
      await sleep(2200);

      // Gọi API hoàn tất thực thi tại bàn và nghiệm thu
      const results = await api.executeWorkstations(currentSession.id);
      setMessages(prev => [...prev, ...results]);

      // Lấy artifact code và test matrix
      const devMsg = results.find(m => m.code_artifact);
      if (devMsg?.code_artifact) setActiveCodeArtifact(devMsg.code_artifact);
      const qaMsg = results.find(m => m.test_matrix);
      if (qaMsg?.test_matrix) setActiveTestMatrix(qaMsg.test_matrix);

      // Giai đoạn 5: Dũng 3 & Dũng 4 bàn giao cho Giám đốc & PM -> Cả 4 người lại ngồi vào Boardroom lần 2!
      setCurrentStageText('Giai đoạn 5: Dũng 3 & Dũng 4 bàn giao cho Giám đốc & PM -> Cả 4 người lại ngồi vào Boardroom lần 2!');
      handleDispatchAgent('dung_1', 'boardroom', 'debating');
      handleDispatchAgent('dung_2', 'boardroom', 'debating');
      handleDispatchAgent('dung_3', 'boardroom', 'debating');
      handleDispatchAgent('dung_4', 'boardroom', 'debating');

      setCamera('boardroom');

      // Hoạt ảnh báo cáo nghiệm thu trên đầu Dũng 1 & Dũng 2
      canvasRef.current?.setCustomBubble('dung_1', '🏆 Họp nghiệm thu Boardroom lần 2 thành công!', 4000);
      await sleep(1500);
      canvasRef.current?.setCustomBubble('dung_2', '✅ Đạt chuẩn triển khai Production 100%!', 4000);

      // Âm thanh vinh quang và TỰ ĐỘNG BẬT POPUP BÁO CÁO NGHIỆM THU TOÀN DIỆN
      soundFx.playSuccess();
      setWorkflowStage('finished');
      setShowFinalReviewModal(true);
      setCurrentStageText('🏆 Hoàn tất 100%! Popup Báo cáo nghiệm thu của Hội đồng 4 Dũng đã hiện lên màn hình.');
    } catch (err) {
      console.error('Lỗi khi thực thi tại bàn làm việc:', err);
      alert('Đã xảy ra lỗi khi thực thi tại bàn làm việc.');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý khi click vào Agent trên Canvas
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

  // Lọc các feature người dùng đã chọn để gửi vào modal
  const activeSelectedFeatures = consensusFeatures.filter(f => selectedFeatureIds.includes(f.id));

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
          workflowStage={workflowStage}
          onExecuteWorkstations={handleExecuteWorkstations}
          onOpenFinalModal={() => setShowFinalReviewModal(true)}
        />

        {/* 2. BỐ CỤC 2 CỘT CHÍNH: BÊN TRÁI (VĂN PHÒNG & CAMERA & CHAT) - BÊN PHẢI (4 DŨNG XẾP DỌC) */}
        <div className="workspace-split-layout">
          {/* CỘT BÊN TRÁI: Camera giám sát, Canvas Pixel Office 2.5D, Consensus Board, Tiến trình tranh luận */}
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

            {/* BẢNG THÔNG TIN CHỐT LẠI (CONSENSUS BOARD) KHI ĐÃ TRANH LUẬN VÒNG 1 XONG */}
            {consensusFeatures.length > 0 && workflowStage === 'waiting_feature_selection' && (
              <ConsensusBoard
                features={consensusFeatures}
                selectedFeatureIds={selectedFeatureIds}
                onToggleFeature={handleToggleFeature}
                onSubmitSelected={handleSelectFeaturesAndDeepDive}
                isLoading={isLoading}
              />
            )}

            {/* Nhật ký tranh luận và sản phẩm bàn giao của 4 Dũng */}
            <DeliberationChat
              messages={messages}
              sessionTitle={currentSession?.title}
              onViewCode={code => setActiveCodeArtifact(code)}
              onViewTestMatrix={matrix => setActiveTestMatrix(matrix)}
            />
          </div>

          {/* CỘT BÊN PHẢI: BỘ TỨ DŨNG THEO CHIỀU DỌC ĐỂ DỄ NHÌN */}
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

      {/* POPUP 1: TỰ ĐỘNG BẬT KHI 4 DŨNG TRANH LUẬN XONG VÒNG 1 ĐỂ BẠN CHỌN Ý PHÁT TRIỂN PHẦN MỀM */}
      <ConsensusModal
        isOpen={showConsensusModal}
        onClose={() => setShowConsensusModal(false)}
        features={consensusFeatures}
        selectedFeatureIds={selectedFeatureIds}
        onToggleFeature={handleToggleFeature}
        onSubmitSelected={handleSelectFeaturesAndDeepDive}
        isLoading={isLoading}
      />

      {/* POPUP 2: TỰ ĐỘNG BẬT KHI 4 DŨNG LÀM XONG Ở BÀN LÀM VIỆC & HỌP BOARDROOM LẦN 2 */}
      <FinalReviewModal
        isOpen={showFinalReviewModal}
        onClose={() => setShowFinalReviewModal(false)}
        session={currentSession}
        selectedFeatures={activeSelectedFeatures.length > 0 ? activeSelectedFeatures : consensusFeatures}
        codeArtifact={activeCodeArtifact}
        testMatrix={activeTestMatrix}
        onViewCode={code => {
          setShowFinalReviewModal(false);
          setActiveCodeArtifact(code);
        }}
        onViewTestMatrix={matrix => {
          setShowFinalReviewModal(false);
          setActiveTestMatrix(matrix);
        }}
      />

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
