/**
 * Bản đồ văn phòng ảo Pixel Office 2.5D Isometric chuẩn phong cách Agent-Pixels
 * Kích thước chuẩn: 960x540 (Tỉ lệ 16:9 Pixel-Perfect)
 */

import { OfficeRoom } from '../types';

export const OFFICE_WIDTH = 960;
export const OFFICE_HEIGHT = 540;

export const ROOMS: OfficeRoom[] = [
  {
    id: 'director_office',
    name: 'Phòng Giám Đốc & Tiếp Khách (Dũng 1)',
    x: 500,
    y: 20,
    width: 210,
    height: 190,
    color: '#0f172a',
    floorColor: '#1e3a5f',
    description: 'Sofa da đỏ, bàn trà tiếp khách, chậu cây phong thủy và tranh nghệ thuật viền vàng.',
    targetX: 595,
    targetY: 65,
  },
  {
    id: 'architect_office',
    name: 'Phòng Kiến Trúc Sư & PM (Dũng 2)',
    x: 20,
    y: 20,
    width: 230,
    height: 190,
    color: '#0f172a',
    floorColor: '#4a3319',
    description: 'Bàn thiết kế kiến trúc, tủ sách kỹ thuật 40 năm kinh nghiệm và server rack.',
    targetX: 140,
    targetY: 152,
  },
  {
    id: 'kitchen_pantry',
    name: 'Khu Cà Phê & Bếp Pantry',
    x: 730,
    y: 20,
    width: 210,
    height: 190,
    color: '#0f172a',
    floorColor: '#e2e8f0',
    description: 'Bình nước nóng lạnh, máy bán đồ uống tự động, bồn rửa inox và tủ lạnh.',
    targetX: 850,
    targetY: 88,
  },
  {
    id: 'dev_lab',
    name: 'Dev Lab & Workstations (Dũng 3)',
    x: 20,
    y: 230,
    width: 230,
    height: 290,
    color: '#0f172a',
    floorColor: '#5c3d1e',
    description: 'Dãy bàn gỗ sồi, máy tính màn hình đôi gõ phím liên tục, cây cảnh và giá sách.',
    targetX: 120,
    targetY: 402,
  },
  {
    id: 'games_room',
    name: 'Phòng Bida & Arcade Retro (Lounge)',
    x: 270,
    y: 290,
    width: 290,
    height: 230,
    color: '#0f172a',
    floorColor: '#4c2859',
    description: 'Bàn bida nỉ xanh lá viền gỗ, bóng bi-a, gậy cơ và máy chơi game arcade cổ điển.',
    targetX: 320,
    targetY: 400,
  },
  {
    id: 'boardroom',
    name: 'Phòng Họp Tranh Luận (Boardroom)',
    x: 580,
    y: 230,
    width: 360,
    height: 290,
    color: '#0f172a',
    floorColor: '#1b3b4b',
    description: 'Bàn họp hội nghị lớn, máy tính điều hành, ghế da xoay và bảng trắng kiến trúc.',
    targetX: 715,
    targetY: 318,
  },
];

