/**
 * Bản đồ văn phòng ảo Cyberpunk High-Tech AI Virtual Office 16:9 (1376x768)
 * - Cửa sổ kính toàn cảnh nhìn ra đại lộ xe bay (Flying Cars & Highway Traffic)
 * - 3 trạm làm việc riêng biệt có màn hình Transparent Holographic HUD
 * - Bàn tròn họp dự án trung tâm với Hologram 3D xoay vòng
 * - Sảnh thư giãn cà phê & ngắm thành phố tương lai
 */

import { OfficeRoom } from '../types';

export const OFFICE_WIDTH = 1376;
export const OFFICE_HEIGHT = 768;

export const ROOMS: OfficeRoom[] = [
  {
    id: 'director_office',
    name: 'Executive Director (Dũng 1)',
    x: 40,
    y: 130,
    width: 320,
    height: 270,
    color: '#3b82f6',
    floorColor: '#0a0e17',
    description: 'Văn phòng Giám Đốc điều hành tối cao, chỉ đạo chiến lược sản phẩm và đàm phán giải pháp kỹ thuật.',
    targetX: 180,
    targetY: 205,
  },
  {
    id: 'architect_office',
    name: 'Trạm Kiến Trúc & PM (Dũng 2)',
    x: 240,
    y: 430,
    width: 190,
    height: 290,
    color: '#8b5cf6',
    floorColor: '#0a0e17',
    description: 'Trạm thẩm định kiến trúc Microservices DAG, phân tích rủi ro hệ thống và quản trị dự án.',
    targetX: 340,
    targetY: 555,
  },
  {
    id: 'dev_lab',
    name: 'Cyber Dev Lab (Dũng 3)',
    x: 50,
    y: 430,
    width: 180,
    height: 290,
    color: '#10b981',
    floorColor: '#0a0e17',
    description: 'Trạm lập trình Fullstack với 2 màn hình Matrix Code xanh lá, phím cơ phát sáng và stream Clean Code.',
    targetX: 145,
    targetY: 555,
  },
  {
    id: 'games_room',
    name: 'Trạm Kiểm Định An Ninh & QA (Dũng 4)',
    x: 440,
    y: 430,
    width: 190,
    height: 290,
    color: '#ef4444',
    floorColor: '#0a0e17',
    description: 'Trạm kiểm định an ninh 360 độ, ma trận Stress Test 5,000 TPS và radar phát hiện lỗ hổng.',
    targetX: 535,
    targetY: 555,
  },
  {
    id: 'boardroom',
    name: 'Bàn Tròn Họp Dự Án Hologram 3D',
    x: 680,
    y: 130,
    width: 650,
    height: 430,
    color: '#38bdf8',
    floorColor: '#0a0e17',
    description: 'Bàn họp tròn trung tâm chiếu Hologram 3D xoay vòng, nơi 4 Dũng gom lại tranh luận phương án tối ưu.',
    targetX: 1000,
    targetY: 340,
  },
  {
    id: 'kitchen_pantry',
    name: 'Sảnh Cafe & Ngắm Xe Bay',
    x: 680,
    y: 580,
    width: 650,
    height: 160,
    color: '#f59e0b',
    floorColor: '#0a0e17',
    description: 'Khu vực thư giãn ngắm thành phố Cyberpunk ngoài cửa sổ kính và nạp năng lượng cà phê.',
    targetX: 960,
    targetY: 640,
  },
];
