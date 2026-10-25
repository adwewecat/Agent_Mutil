/**
 * Component trung tâm kết nối toàn bộ hệ thống Virtual Pixel Office và 4 Dũng
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Agent, CameraView, DeliberationMessage, ProjectSession, SystemHealth } from './types';
import { api } from './services/api';
import { Header } from './components/Header';
import { SecurityCameraBar } from './components/SecurityCameraBar';
import { OfficeCanvas } from './office/OfficeCanvas';
import { AgentCard } from './components/AgentCard';
import { WorkflowPanel } from './components/WorkflowPanel';
import { DeliberationChat } from './components/DeliberationChat';
import { CodeArtifactViewer } from './components/CodeArtifactViewer';
import { TestMatrixModal } from './components/TestMatrixModal';
import { SystemStatusModal } from './components/SystemStatusModal';
import { soundFx } from './office/soundEffects';

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

  // Trạng thái Modals
  const [activeCodeArtifact, setActiveCodeArtifact] = useState<string | null>(null);
  const [activeTestMatrix, setActiveTestMatrix] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);

  // 1. Nạp dữ liệu ban đầu khi mở ứng dụng
  const loadInitialData = useCallback(async () => {
    try {
      // Tải danh sách 4 Dũng
      const agentsData = await api.getAgents();
      setAgents(agentsData);

      // Tải sức khỏe hệ thống & kết nối DB
      const healthData = await api.getHealth();
      setHealth(healthData);

      // Tải phiên làm việc gần nhất nếu có
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

  // 2. Xử lý điều động Agent sang phòng làm việc
  const handleDispatchAgent = async (code: string, room: string) => {
    try {
      const updatedAgent = await api.moveAgent(code, room);
      setAgents(prev => prev.map(a => (a.code === updatedAgent.code ? updatedAgent : a)));
      soundFx.playCameraSwitch();
    } catch (err) {
      console.error('Không thể điều động Agent:', err);
    }
  };

  // 3. Xử lý kích hoạt chu trình làm việc 4 Dũng
  const handleRunWorkflow = async (problem: string, step: string) => {
    setIsLoading(true);
    setCurrentStageText('Đang khởi tạo phiên làm việc...');

    try {
      // Tạo session mới cho đề bài
      const session = await api.createSession(problem);
      setCurrentSession(session);

      // Chuyển camera về phòng họp để theo dõi trực tiếp
      setCamera('boardroom');
      soundFx.playAlert();

      // Kích hoạt chu trình
      setCurrentStageText(
        step === 'full_cycle'
          ? 'Đang thực thi chu trình tuần tự (Dũng 1 ➔ Dũng 2 ➔ Dũng 3 ➔ Dũng 4)'
          : `Đang thực thi bước: ${step}`
      );

      const newMessages = await api.triggerWorkflow(session.id, step);
      setMessages(newMessages);

      // Cập nhật lại vị trí và trạng thái của 4 Dũng từ server
      const refreshedAgents = await api.getAgents();
      setAgents(refreshedAgents);

      // Phát âm thanh chiến thắng khi hoàn thành
      soundFx.playSuccess();
    } catch (err) {
      console.error('Lỗi khi chạy workflow:', err);
      alert('Đã xảy ra lỗi khi thực thi quy trình. Vui lòng kiểm tra Backend FastAPI!');
    } finally {
      setIsLoading(false);
      setCurrentStageText('');
    }
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
        {/* Thanh chuyển đổi góc quay camera an ninh */}
        <SecurityCameraBar currentCamera={camera} onSelectCamera={setCamera} />

        {/* Khung Canvas Game Engine mô phỏng văn phòng ảo Pixel Office */}
        <OfficeCanvas
          agents={agents}
          camera={camera}
          scanlinesEnabled={scanlinesEnabled}
        />

        {/* Danh sách 4 Dũng AI với 40 năm kinh nghiệm */}
        <section className="agents-section">
          <div className="agents-grid">
            {agents.map(agent => (
              <AgentCard
                key={agent.id || agent.code}
                agent={agent}
                onDispatch={handleDispatchAgent}
              />
            ))}
          </div>
        </section>

        {/* Bảng nhập đề bài & điều phối chu trình */}
        <WorkflowPanel
          onRunWorkflow={handleRunWorkflow}
          isLoading={isLoading}
          currentStage={currentStageText}
        />

        {/* Nhật ký tranh luận và sản phẩm bàn giao của 4 Dũng */}
        <DeliberationChat
          messages={messages}
          sessionTitle={currentSession?.title}
          onViewCode={code => setActiveCodeArtifact(code)}
          onViewTestMatrix={matrix => setActiveTestMatrix(matrix)}
        />

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
