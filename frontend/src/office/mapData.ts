/**
 * Bản đồ văn phòng ảo Pixel Office 4D Isometric chuẩn phong cách Pinterest Pin 412290540892514371
 * Kích thước chuẩn: 960x540 (Tỉ lệ 16:9 Pixel-Perfect)
 * Bố cục văn phòng mở (Open-Plan) với các cụm vách ngăn Cubicle, phân bổ đúng 7 chỗ ngồi công sở
 */

import { OfficeRoom } from '../types';

export const OFFICE_WIDTH = 800;
export const OFFICE_HEIGHT = 1200;

export const ROOMS: OfficeRoom[] = [
  {
    id: 'director_office',
    name: 'Tầng 4: Penthouse Giám Đốc (Dũng 1)',
    x: 240,
    y: 320,
    width: 320,
    height: 140,
    color: '#3b82f6',
    floorColor: '#0f172a',
    description: 'Skydeck điều hành tối cao nhìn toàn cảnh thành phố tương lai, Hologram AI toàn cầu và phòng chỉ đạo chiến lược.',
    targetX: 395,
    targetY: 385, // Vị trí Dũng 1 tại Tầng 4
  },
  {
    id: 'architect_office',
    name: 'Tầng 3: Bàn Tròn Kiến Trúc & PM (Dũng 2)',
    x: 240,
    y: 490,
    width: 320,
    height: 150,
    color: '#8b5cf6',
    floorColor: '#0f172a',
    description: 'Bàn họp tròn trung tâm chiếu Hologram 3D Microservices DAG, thẩm định tải hệ thống và phản biện rủi ro.',
    targetX: 395,
    targetY: 555, // Vị trí Dũng 2 tại Tầng 3
  },
  {
    id: 'dev_lab',
    name: 'Tầng 2: Cyber Dev Workshop (Dũng 3)',
    x: 240,
    y: 670,
    width: 320,
    height: 150,
    color: '#10b981',
    floorColor: '#0f172a',
    description: 'Trạm lập trình Fullstack với màn hình Matrix Code Rain neon, phím cơ RGB, stream dữ liệu và clean code.',
    targetX: 380,
    targetY: 750, // Vị trí Dũng 3 tại Tầng 2
  },
  {
    id: 'games_room',
    name: 'Tầng 1: QA Cyber Defense (Dũng 4)',
    x: 240,
    y: 860,
    width: 320,
    height: 160,
    color: '#ef4444',
    floorColor: '#0f172a',
    description: 'Trạm kiểm định an ninh 360 độ, ma trận stress test 5,000 TPS và khiên phòng thủ cyber shield.',
    targetX: 395,
    targetY: 940, // Vị trí Dũng 4 tại Tầng 1
  },
  {
    id: 'boardroom',
    name: 'Hội Đồng Chiến Lược Tranh Luận (Tầng 3 & 4)',
    x: 240,
    y: 490,
    width: 320,
    height: 150,
    color: '#38bdf8',
    floorColor: '#0f172a',
    description: 'Hội đồng tranh luận đa tầng giữa Giám đốc Dũng 1 và Kiến trúc sư Dũng 2 qua cầu truyền hình Hologram.',
    targetX: 395,
    targetY: 555, // Bàn tròn tranh luận Tầng 3
  },
  {
    id: 'kitchen_pantry',
    name: 'Sảnh Cafe & Tiếp Đón Tầng 1',
    x: 350,
    y: 920,
    width: 180,
    height: 100,
    color: '#f59e0b',
    floorColor: '#0f172a',
    description: 'Khu vực giải lao và sảnh kính đón khách tại tầng trệt của Tháp Công Nghệ AI.',
    targetX: 440,
    targetY: 940, // Sảnh tầng trệt
  },
];
