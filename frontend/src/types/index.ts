/**
 * Định nghĩa kiểu dữ liệu TypeScript cho toàn bộ Frontend Agent Multi
 */

export type AgentCode = 'dung_1' | 'dung_2' | 'dung_3' | 'dung_4';

export type AgentStatus = 'idle' | 'moving' | 'debating' | 'coding' | 'testing' | 'resting';

export interface Agent {
  id: number;
  code: AgentCode;
  name: string;
  role: string;
  experience_years: number;
  specialty: string;
  status: AgentStatus;
  current_room: string;
  pos_x: number;
  pos_y: number;
  target_x: number;
  target_y: number;
  avatar_color: string;
}

export interface DeliberationMessage {
  id: number;
  session_id: number;
  agent_code: string;
  agent_name: string;
  stage: string;
  content: string;
  code_artifact?: string | null;
  test_matrix?: string | null;
  timestamp: string;
}

export interface ProjectSession {
  id: number;
  title: string;
  user_problem: string;
  status: 'pending' | 'in_progress' | 'waiting_approval' | 'completed' | 'failed';
  current_stage: string;
  created_at: string;
  updated_at: string;
  messages: DeliberationMessage[];
}

export type CameraView =
  | 'overview'
  | 'director_office'
  | 'architect_office'
  | 'boardroom'
  | 'dev_lab'
  | 'games_room'
  | 'kitchen_pantry';


export interface OfficeRoom {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  floorColor: string;
  description: string;
  targetX: number;
  targetY: number;
}

export interface SystemHealth {
  status: string;
  app_name: string;
  version: string;
  database_type: string;
  database_connected: boolean;
  agents_count: number;
}
