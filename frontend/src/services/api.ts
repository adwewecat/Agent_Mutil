/**
 * Service giao tiếp REST API & WebSocket với Backend FastAPI
 */

import { Agent, ProjectSession, DeliberationMessage, SystemHealth } from '../types';

const API_BASE = '/api';

export const api = {
  /**
   * Lấy danh sách 4 Dũng
   */
  async getAgents(): Promise<Agent[]> {
    const res = await fetch(`${API_BASE}/agents`);
    if (!res.ok) throw new Error('Không thể tải danh sách Agent');
    return res.json();
  },

  /**
   * Lấy danh sách các phiên làm việc
   */
  async getSessions(): Promise<ProjectSession[]> {
    const res = await fetch(`${API_BASE}/sessions`);
    if (!res.ok) throw new Error('Không thể tải danh sách phiên làm việc');
    return res.json();
  },

  /**
   * Tạo đề bài mới cho 4 Dũng
   */
  async createSession(userProblem: string, title?: string): Promise<ProjectSession> {
    const res = await fetch(`${API_BASE}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_problem: userProblem, title }),
    });
    if (!res.ok) throw new Error('Không thể tạo phiên làm việc mới');
    return res.json();
  },

  /**
   * Kích hoạt chu trình làm việc của 4 Dũng (director, architect, developer, qa, full_cycle)
   */
  async triggerWorkflow(sessionId: number, step: string): Promise<DeliberationMessage[]> {
    const res = await fetch(`${API_BASE}/workflow/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, step }),
    });
    if (!res.ok) throw new Error('Lỗi kích hoạt chu trình 4 Dũng');
    return res.json();
  },

  /**
   * Phê duyệt phương án của Dũng 1 & Dũng 2 để kích hoạt Dũng 3 & Dũng 4
   */
  async approveWorkflow(sessionId: number): Promise<DeliberationMessage[]> {
    const res = await fetch(`${API_BASE}/workflow/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    });
    if (!res.ok) throw new Error('Lỗi phê duyệt phương án');
    return res.json();
  },

  /**
   * Điều động Agent sang phòng khác
   */
  async moveAgent(code: string, room: string): Promise<Agent> {
    const res = await fetch(`${API_BASE}/agents/${code}/move-to-room?room=${room}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Không thể điều động Agent');
    return res.json();
  },

  /**
   * Kiểm tra sức khỏe hệ thống và kết nối SQL Server
   */
  async getHealth(): Promise<SystemHealth> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Lỗi kiểm tra hệ thống');
    return res.json();
  },
};
