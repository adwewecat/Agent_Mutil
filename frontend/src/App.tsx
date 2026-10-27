/**
 * Component trung tâm kết nối toàn bộ hệ thống Virtual Pixel Office và Bộ Ba Chuyên Gia (3 Nhân Viên Dũng)
 * Triển khai chu trình chuẩn nghiệp vụ kèm HOẠT ẢNH TRÊN ĐẦU NHÂN VẬT & TỰ ĐỘNG BẬT POPUP:
 * 1. Nhân viên 1 (GĐ Vận hành F&B 40 năm KN) & Nhân viên 2 (GĐ Phần mềm 40 năm KN) ngồi vào Boardroom tranh luận nảy lửa.
 * 2. Đối chiếu đối thủ thị trường (McD, Starbucks vs Toast POS, Square) -> TỰ ĐỘNG BẬT POPUP BẢNG THỐNG NHẤT (ConsensusModal).
 * 3. Người dùng duyệt từng ý -> Nhân viên 3 (Senior Dev 30 năm KN) mới thực sự bắt đầu lập trình.
 * 4. Nhân viên 3 về Dev Lab viết Clean Code chuẩn OpenAPI, bọc bảo mật HMAC SHA-256 & Idempotency Key.
 * 5. Bàn giao kết quả -> Nhân viên 1 & Nhân viên 2 đánh giá, nghiệm thu -> TỰ ĐỘNG BẬT POPUP NGHIỆM THU (FinalReviewModal).
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
  // Trạng thái dữ liệu 3 Nhân Viên
  const [agents, setAgents] = useState<Agent[]>([]);
  const [currentSession, setCurrentSession] = useState<ProjectSession | null>(null);
  const [messages, setMessages] = useState<DeliberationMessage[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);

  // Trạng thái quy trình thống nhất & phê duyệt
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

  // 2. Xử lý điều động Agent sang phòng làm việc (Bố cục 3 nhân viên đối xứng quanh bàn tròn)
  const handleDispatchAgent = (code: string, room: string, statusOverride?: string) => {
    const targetCoords: Record<string, { x: number; y: number }> = {
      boardroom: {
        dung_1: { x: 1000, y: 275 },  // Ghế Bắc: Phía trên bàn tròn (Nhân viên 1 - GĐ Vận hành F&B 40 năm KN)
        dung_2: { x: 860, y: 375 },   // Ghế Tây-Nam: Trái dưới bàn tròn (Nhân viên 2 - GĐ Phần mềm 40 năm KN)
        dung_3: { x: 1140, y: 375 },  // Ghế Đông-Nam: Phải dưới bàn tròn (Nhân viên 3 - Senior Dev 30 năm KN)
      }[code] || { x: 1000, y: 340 },
      director_office: { x: 230, y: 260 }, // Phòng GĐ Vận hành F&B (Nhân viên 1)
      architect_office: { x: 385, y: 620 }, // Trạm Kiến Trúc & GĐ Phần mềm (Nhân viên 2)
      dev_lab: { x: 185, y: 620 }, // Trạm Cyber Dev Lab (Nhân viên 3)
      games_room: { x: 585, y: 620 }, // Khu vực giải trí bida
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

  // 3. GIAI ĐOẠN 1: TRANH LUẬN NẢY LỬA GIỮA NHÂN VIÊN 1 & NHÂN VIÊN 2 (TỰ ĐỘNG BẬT POPUP BẢNG THỐNG NHẤT)
  const handleRunWorkflow = async (problem: string, _step: string) => {
    setIsLoading(true);
    setShowFinalReviewModal(false);
    setShowConsensusModal(false);
    setConsensusFeatures([]);
    setSelectedFeatureIds([]);

    try {
      const session = await api.createSession(problem);
      setCurrentSession(session);

      // Gom 3 nhân viên về phòng họp trung tâm
      canvasRef.current?.cancelBreak();
      handleDispatchAgent('dung_1', 'boardroom', 'debating');
      handleDispatchAgent('dung_2', 'boardroom', 'debating');
      handleDispatchAgent('dung_3', 'boardroom', 'idle');

      setCamera('boardroom');
      soundFx.playAlert();
      setCurrentStageText('Giai đoạn 1: Nhân viên 1 (F&B) & Nhân viên 2 (Software) đang tranh luận nảy lửa và đối chiếu đối thủ thị trường...');

      // Diễn hoạt bong bóng thoại tranh luận nảy lửa trên đầu Nhân viên 1 & Nhân viên 2
      canvasRef.current?.setCustomBubble('dung_1', '🥩 NV1 (40 năm F&B): Bóc tách quy trình gọi món, case study McDonald\'s & Starbucks...', 3500);
      await sleep(1800);

      canvasRef.current?.setCustomBubble('dung_2', '💻 NV2 (40 năm Software): Phản biện toàn diện hệ thống, Toast POS & rủi ro nghẽn mạng...', 3500);
      await sleep(1800);

      canvasRef.current?.setCustomBubble('dung_1', '⚡ NV1: Tranh luận nảy lửa về rớt đơn, gian lận QR và rủi ro giờ cao điểm!', 3500);
      await sleep(1800);

      canvasRef.current?.setCustomBubble('dung_2', '🛡️ NV2: Chốt tỷ lệ % đáp ứng, giải pháp mềm SOP & khóa đặc tả cho Dev 3!', 3500);
      await sleep(1800);

      // Kích hoạt tranh luận trên Backend
      const newMsgs = await api.triggerWorkflow(session.id, 'initial_deliberation');
      setMessages(newMsgs);

      // Lấy Bảng Thông Tin Thống Nhất (Consensus Matrix)
      const features = await api.getConsensusFeatures(session.id);
      setConsensusFeatures(features);

      // Mặc định chọn tất cả để người dùng dễ xem và duyệt
      setSelectedFeatureIds(features.map(f => f.id));

      setWorkflowStage('waiting_feature_selection');
      soundFx.playAlert();
      setCurrentStageText('Giai đoạn 2: Bảng thống nhất đã sẵn sàng! Popup đã hiện lên để bạn duyệt từng ý cho Nhân viên 3 thực thi.');

      // TỰ ĐỘNG BẬT POPUP BẢNG THỐNG NHẤT CHO NGƯỜI DÙNG DUYỆT!
      setShowConsensusModal(true);
    } catch (err) {
      console.error('Lỗi khi chạy workflow:', err);
      alert('Đã xảy ra lỗi kết nối khi thực thi quy trình.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Xử lý duyệt hoặc bỏ duyệt từng ý tưởng trong Bảng Thống Nhất
  const handleToggleFeature = (id: string) => {
    setSelectedFeatureIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // 5. GIAI ĐOẠN 3: NGƯỜI DÙNG DUYỆT TỪNG Ý -> CHUYỂN GIAO CHO NHÂN VIÊN 3 (SENIOR DEV 30 NĂM KN)
  const handleSelectFeaturesAndDeepDive = async () => {
    if (!currentSession || selectedFeatureIds.length === 0) return;
    setIsLoading(true);
    setShowConsensusModal(false);

    try {
      setCamera('boardroom');
      soundFx.playType();
      setCurrentStageText('Giai đoạn 3: Người dùng đã duyệt các ý! Nhân viên 1 & 2 chuyển giao cái cần thực thi cho Nhân viên 3...');

      // Hoạt ảnh bong bóng thoại trên đầu 3 nhân viên khi chốt bàn giao nhiệm vụ
      canvasRef.current?.setCustomBubble('dung_1', `📋 NV1: Đã nhận lệnh duyệt ${selectedFeatureIds.length} ý từ Bạn, bàn giao cho Dev 3!`, 3000);
      await sleep(1500);
      canvasRef.current?.setCustomBubble('dung_2', '📐 NV2: Đã khóa spec kỹ thuật HMAC SHA-256 & Idempotency Key!', 3000);
      await sleep(1500);
      canvasRef.current?.setCustomBubble('dung_3', '👨‍💻 NV3 (Dev 30 năm KN): Tiếp nhận nhiệm vụ đã duyệt, sẵn sàng lập trình Clean Code!', 3000);

      const deepDiveMsgs = await api.selectFeaturesAndDeepDive(currentSession.id, selectedFeatureIds);
      setMessages(prev => [...prev, ...deepDiveMsgs]);

      setWorkflowStage('ready_for_workstations');
      soundFx.playAlert();
      setCurrentStageText('Đã duyệt nhiệm vụ! Bấm nút "Lệnh cho Nhân viên 3 vào Dev Lab lập trình" ở trên để thực thi.');
    } catch (err) {
      console.error('Lỗi khi gửi lựa chọn tính năng:', err);
      alert('Đã xảy ra lỗi khi gửi lựa chọn tính năng.');
    } finally {
      setIsLoading(false);
    }
  };

  // 6. GIAI ĐOẠN 4 & 5: NHÂN VIÊN 3 LẬP TRÌNH TẠI BÀN -> BÁO CÁO ĐỂ NHÂN VIÊN 1 & 2 ĐÁNH GIÁ, NGHIỆM THU
  const handleExecuteWorkstations = async () => {
    if (!currentSession) return;
    setIsLoading(true);

    try {
      // Giai đoạn 4: Nhân viên 3 vào Dev Lab gõ Clean Code
      setCurrentStageText('Giai đoạn 4: Nhân viên 3 (Senior Dev 30 năm KN) đang viết Clean Code FastAPI Async & Unit Tests...');
      handleDispatchAgent('dung_1', 'director_office', 'idle');
      handleDispatchAgent('dung_2', 'architect_office', 'idle');
      handleDispatchAgent('dung_3', 'dev_lab', 'coding');

      setCamera('dev_lab');
      soundFx.playType();

      // Hoạt ảnh gõ code trên đầu Nhân viên 3
      canvasRef.current?.setCustomBubble('dung_3', '⚡ Đang gõ phím Clean Code: FastAPI + HMAC SHA-256 + Idempotency...', 3500);

      // Chờ 3.0s mô phỏng gõ phím ở Dev Lab
      await sleep(3000);

      // Gọi API hoàn tất thực thi tại bàn và nghiệm thu
      const results = await api.executeWorkstations(currentSession.id);
      setMessages(prev => [...prev, ...results]);

      // Lấy artifact code và test matrix
      const devMsg = results.find(m => m.code_artifact);
      if (devMsg?.code_artifact) setActiveCodeArtifact(devMsg.code_artifact);
      const qaMsg = results.find(m => m.test_matrix);
      if (qaMsg?.test_matrix) setActiveTestMatrix(qaMsg.test_matrix);

      // Giai đoạn 5: Nhân viên 3 báo cáo lại để Nhân viên 1 & 2 đánh giá, nghiệm thu
      setCurrentStageText('Giai đoạn 5: Nhân viên 3 báo cáo lại cho Nhân viên 1 & Nhân viên 2 đánh giá và nghiệm thu toàn diện!');
      handleDispatchAgent('dung_1', 'boardroom', 'debating');
      handleDispatchAgent('dung_2', 'boardroom', 'debating');
      handleDispatchAgent('dung_3', 'boardroom', 'idle');

      setCamera('boardroom');

      // Hoạt ảnh báo cáo và nghiệm thu trên đầu 3 nhân viên
      canvasRef.current?.setCustomBubble('dung_3', '📋 NV3: Đã lập trình xong phần mềm theo các ý duyệt, kính trình nghiệm thu!', 3500);
      await sleep(1800);
      canvasRef.current?.setCustomBubble('dung_1', '✅ NV1 (GĐ F&B): Nghiệm thu quy trình vận hành & chống rớt đơn tuyệt đối!', 3500);
      await sleep(1800);
      canvasRef.current?.setCustomBubble('dung_2', '🏆 NV2 (GĐ Phần mềm): Nghiệm thu Clean Code 1.5ms, ký phê chuẩn bàn giao!', 3500);

      // Âm thanh vinh quang và TỰ ĐỘNG BẬT POPUP BÁO CÁO NGHIỆM THU CHO NGƯỜI DÙNG
      soundFx.playSuccess();
      setWorkflowStage('finished');
      setShowFinalReviewModal(true);
      setCurrentStageText('🏆 Hoàn tất 100%! Popup Báo cáo nghiệm thu của Nhân viên 1 & Nhân viên 2 đã hiện lên màn hình.');
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
        {/* 1. GIAO ĐỀ BÀI CHO BỘ BA CHUYÊN GIA - ĐẶT Ở TRÊN CÙNG THEO YÊU CẦU */}
        <WorkflowPanel
          onRunWorkflow={handleRunWorkflow}
          isLoading={isLoading}
          currentStage={currentStageText}
          workflowStage={workflowStage}
          onExecuteWorkstations={handleExecuteWorkstations}
          onOpenFinalModal={() => setShowFinalReviewModal(true)}
          onOpenConsensusModal={() => setShowConsensusModal(true)}
        />

        {/* 2. BỐ CỤC 2 CỘT CHÍNH: BÊN TRÁI (VĂN PHÒNG & CAMERA & CHAT) - BÊN PHẢI (3 NHÂN VIÊN XẾP DỌC) */}
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

            {/* BẢNG THÔNG TIN THỐNG NHẤT (CONSENSUS BOARD) KHI ĐÃ TRANH LUẬN XONG & ĐÃ ĐÓNG POPUP */}
            {consensusFeatures.length > 0 && workflowStage === 'waiting_feature_selection' && !showConsensusModal && (
              <ConsensusBoard
                features={consensusFeatures}
                selectedFeatureIds={selectedFeatureIds}
                onToggleFeature={handleToggleFeature}
                onSubmitSelected={handleSelectFeaturesAndDeepDive}
                isLoading={isLoading}
              />
            )}

            {/* Nhật ký tranh luận và sản phẩm bàn giao */}
            <DeliberationChat
              messages={messages}
              sessionTitle={currentSession?.title}
              onViewCode={code => setActiveCodeArtifact(code)}
              onViewTestMatrix={matrix => setActiveTestMatrix(matrix)}
            />
          </div>

          {/* CỘT BÊN PHẢI: BỘ BA CHUYÊN GIA DŨNG THEO CHIỀU DỌC */}
          <aside className="right-agents-sidebar">
            <div className="sidebar-sticky-header">
              <div className="flex items-center justify-between">
                <span className="sidebar-badge-title">👥 BỘ BA CHUYÊN GIA (3 NHÂN VIÊN)</span>
                <span className="status-live-indicator">SẴN SÀNG</span>
              </div>
              <p className="sidebar-desc">
                Nhân viên 1 (F&B 40 năm) • Nhân viên 2 (Software 40 năm) • Nhân viên 3 (Dev 30 năm).
                Click vào nhân vật hoặc chọn nút phòng để điều động!
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

      {/* POPUP 1: TỰ ĐỘNG BẬT KHI NHÂN VIÊN 1 & 2 TRANH LUẬN XONG ĐỂ BẠN DUYỆT TỪNG Ý CHO NHÂN VIÊN 3 THỰC THI */}
      <ConsensusModal
        isOpen={showConsensusModal}
        onClose={() => setShowConsensusModal(false)}
        features={consensusFeatures}
        selectedFeatureIds={selectedFeatureIds}
        onToggleFeature={handleToggleFeature}
        onSubmitSelected={handleSelectFeaturesAndDeepDive}
        isLoading={isLoading}
      />

      {/* POPUP 2: TỰ ĐỘNG BẬT KHI NHÂN VIÊN 3 LÀM XONG & ĐƯỢC NHÂN VIÊN 1 & 2 ĐÁNH GIÁ, NGHIỆM THU */}
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

      {/* Modal hiển thị mã nguồn Clean Code của Nhân viên 3 */}
      {activeCodeArtifact && (
        <CodeArtifactViewer
          code={activeCodeArtifact}
          onClose={() => setActiveCodeArtifact(null)}
        />
      )}

      {/* Modal hiển thị ma trận kiểm thử */}
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
