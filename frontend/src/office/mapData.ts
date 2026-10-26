/**
 * Bản đồ văn phòng ảo Pixel Office 4D Isometric chuẩn phong cách Pinterest Pin 412290540892514371
 * Kích thước chuẩn: 960x540 (Tỉ lệ 16:9 Pixel-Perfect)
 * Bố cục văn phòng mở (Open-Plan) với các cụm vách ngăn Cubicle, phân bổ đúng 7 chỗ ngồi công sở
 */

import { OfficeRoom } from '../types';

export const OFFICE_WIDTH = 900;
export const OFFICE_HEIGHT = 695;

export const ROOMS: OfficeRoom[] = [
  {
    id: 'director_office',
    name: 'Góc Giám Đốc Điều Hành (Dũng 1)',
    x: 430,
    y: 200,
    width: 200,
    height: 180,
    color: '#0f172a',
    floorColor: '#f7e7ce',
    description: 'Bàn điều hành L-shape góc riêng sau vách ngăn, điện thoại bàn và máy tính quản trị.',
    targetX: 505,
    targetY: 265, // Ghế xoay giám đốc sau vách ngăn
  },
  {
    id: 'architect_office',
    name: 'Bàn Kiến Trúc Sư & PM (Dũng 2)',
    x: 390,
    y: 150,
    width: 140,
    height: 120,
    color: '#0f172a',
    floorColor: '#f7e7ce',
    description: 'Trạm làm việc kiến trúc sư cạnh giá sách tường, màn hình CAD và bản vẽ hệ thống.',
    targetX: 425,
    targetY: 230, // Ghế xoay L3 cạnh giá sách
  },
  {
    id: 'dev_lab',
    name: 'Trạm Fullstack Dev (Dũng 3)',
    x: 200,
    y: 200,
    width: 200,
    height: 160,
    color: '#0f172a',
    floorColor: '#f7e7ce',
    description: 'Bàn lập trình viên chính với màn hình máy tính Windows desktop, phím cơ và chuột.',
    targetX: 345,
    targetY: 265, // Ghế xoay L2 trước máy tính
  },
  {
    id: 'games_room',
    name: 'Trạm QA & Máy In Laser (Dũng 4)',
    x: 480,
    y: 330,
    width: 220,
    height: 160,
    color: '#0f172a',
    floorColor: '#f7e7ce',
    description: 'Trạm kiểm thử QA chuyên dụng, máy in/photocopier đa năng laser đứng đầu dãy.',
    targetX: 595,
    targetY: 395, // Ghế xoay F2 trước máy tính kiểm thử
  },
  {
    id: 'boardroom',
    name: 'Bàn Họp Chiến Lược Trung Tâm',
    x: 280,
    y: 260,
    width: 280,
    height: 230,
    color: '#0f172a',
    floorColor: '#f7e7ce',
    description: 'Bàn họp oval gỗ sồi hiện đại, 6 ghế trắng, 2 laptop và sổ tay chiến lược.',
    targetX: 450,
    targetY: 360, // Bàn họp trung tâm
  },
  {
    id: 'kitchen_pantry',
    name: 'Khu Trưng Bày & Giải Lao',
    x: 520,
    y: 120,
    width: 260,
    height: 120,
    color: '#0f172a',
    floorColor: '#f7e7ce',
    description: 'Dãy tủ kệ gỗ dài dọc tường sau, bình hoa gốm sứ trang trí và cửa sổ rèm roman đón nắng.',
    targetX: 680,
    targetY: 240, // Đi lại thư giãn cạnh tủ kệ
  },
];
