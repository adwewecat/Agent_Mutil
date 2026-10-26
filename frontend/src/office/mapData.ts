/**
 * Bản đồ văn phòng ảo Pixel Office 4D Isometric chuẩn phong cách Pinterest Pin 412290540892514371
 * Kích thước chuẩn: 960x540 (Tỉ lệ 16:9 Pixel-Perfect)
 * Bố cục văn phòng mở (Open-Plan) với các cụm vách ngăn Cubicle, phân bổ đúng 7 chỗ ngồi công sở
 */

import { OfficeRoom } from '../types';

export const OFFICE_WIDTH = 800;
export const OFFICE_HEIGHT = 800;

export const ROOMS: OfficeRoom[] = [
  {
    id: 'director_office',
    name: 'Góc Giám Đốc Điều Hành (Dũng 1)',
    x: 420,
    y: 150,
    width: 250,
    height: 180,
    color: '#0f172a',
    floorColor: '#f7e7ce',
    description: 'Bàn giám đốc gỗ óc chó cao cấp, ghế da xám bọc công thái học và view kính thành phố.',
    targetX: 430,
    targetY: 200, // Ghế xoay giám đốc
  },
  {
    id: 'architect_office',
    name: 'Bàn Kiến Trúc Sư & PM (Dũng 2)',
    x: 180,
    y: 300,
    width: 150,
    height: 100,
    color: '#0f172a',
    floorColor: '#f7e7ce',
    description: 'Bàn làm việc cụm hiện đại, vách ngăn vàng nổi bật và laptop thiết kế kiến trúc.',
    targetX: 250,
    targetY: 340, // Ghế vàng trên
  },
  {
    id: 'dev_lab',
    name: 'Trạm Fullstack Dev (Dũng 3)',
    x: 180,
    y: 440,
    width: 150,
    height: 110,
    color: '#0f172a',
    floorColor: '#f7e7ce',
    description: 'Trạm lập trình Fullstack tại bàn làm việc gỗ sồi, gõ phím cơ và màn hình lập trình.',
    targetX: 245,
    targetY: 490, // Ghế vàng dưới
  },
  {
    id: 'games_room',
    name: 'Trạm QA & Test Lead (Dũng 4)',
    x: 270,
    y: 390,
    width: 140,
    height: 110,
    color: '#0f172a',
    floorColor: '#f7e7ce',
    description: 'Trạm kiểm thử hệ thống & phân tích test cases, ma trận stress test.',
    targetX: 320,
    targetY: 440, // Ghế vàng cạnh phải
  },
  {
    id: 'boardroom',
    name: 'Khu VIP Lounge & Thảo Luận',
    x: 600,
    y: 300,
    width: 190,
    height: 200,
    color: '#0f172a',
    floorColor: '#f7e7ce',
    description: 'Khu tiếp khách VIP & thảo luận chiến lược, sofa da đen 3 chỗ và bàn trà kính.',
    targetX: 660,
    targetY: 360, // Bàn VIP Lounge
  },
  {
    id: 'kitchen_pantry',
    name: 'Khu Trưng Bày & Bình Nước Khoáng',
    x: 580,
    y: 500,
    width: 200,
    height: 170,
    color: '#0f172a',
    floorColor: '#f7e7ce',
    description: 'Tủ lưu trữ gỗ cây cảnh, bình nước nóng lạnh và lối đi sảnh chính.',
    targetX: 645,
    targetY: 560, // Đi lại thư giãn tại bình nước
  },
];
