/**
 * Bản đồ văn phòng ảo Pixel Office 2.5D Isometric chuẩn phong cách The Pixel Office & Agent-Pixels
 * Kích thước chuẩn: 960x540 (Tỉ lệ 16:9 Pixel-Perfect)
 * Bố cục không gian mở thoáng đãng, phân chia 5 phòng ban khoa học, không chồng chéo vật dụng
 */

import { OfficeRoom } from '../types';

export const OFFICE_WIDTH = 960;
export const OFFICE_HEIGHT = 540;

export const ROOMS: OfficeRoom[] = [
  {
    id: 'architect_office',
    name: 'Phòng Kiến Trúc Sư & PM (Dũng 2)',
    x: 30,
    y: 80,
    width: 280,
    height: 195,
    color: '#0f172a',
    floorColor: '#4a3319',
    description: 'Sàn gỗ sồi, bàn làm việc 2 màn hình, kệ sách kỹ thuật 40 năm kinh nghiệm và server rack.',
    targetX: 125,
    targetY: 195, // Ngồi ghế xoay trước bàn thiết kế
  },
  {
    id: 'director_office',
    name: 'Phòng Giám Đốc & Tiếp Khách (Dũng 1)',
    x: 330,
    y: 80,
    width: 320,
    height: 195,
    color: '#0f172a',
    floorColor: '#1e3a5f',
    description: 'Thảm sapphire hoàng gia, sofa da đỏ cao cấp, bàn trà gỗ tiếp khách và tranh nghệ thuật viền vàng.',
    targetX: 470,
    targetY: 130, // Ngồi trên sofa da đỏ tiếp khách
  },
  {
    id: 'kitchen_pantry',
    name: 'Khu Cà Phê & Bếp Pantry',
    x: 670,
    y: 80,
    width: 260,
    height: 195,
    color: '#0f172a',
    floorColor: '#e2e8f0',
    description: 'Quầy bar inox, tủ lạnh 2 cánh, máy bán nước tự động và bình nước khoáng nóng lạnh.',
    targetX: 740,
    targetY: 165, // Đứng trước quầy bar cà phê
  },
  {
    id: 'dev_lab',
    name: 'Dev Lab & Workstations (Dũng 3)',
    x: 30,
    y: 315,
    width: 290,
    height: 195,
    color: '#0f172a',
    floorColor: '#5c3d1e',
    description: 'Trạm lập trình Fullstack màn hình kép nhấp nháy Clean Code, ghế công thái học và kệ tài liệu.',
    targetX: 135,
    targetY: 410, // Ngồi ghế xoay trước máy tính gõ code
  },
  {
    id: 'boardroom',
    name: 'Phòng Họp Tranh Luận (Boardroom)',
    x: 340,
    y: 315,
    width: 310,
    height: 195,
    color: '#0f172a',
    floorColor: '#16384c',
    description: 'Bàn họp hội đồng dài bằng gỗ óc chó, 6 ghế xoay nỉ xanh, laptop điều hành và bảng trắng kiến trúc.',
    targetX: 450,
    targetY: 355, // Ngồi ghế họp hội nghị dãy trên
  },
  {
    id: 'games_room',
    name: 'Phòng Bida & Arcade Retro (Dũng 4)',
    x: 670,
    y: 315,
    width: 260,
    height: 195,
    color: '#0f172a',
    floorColor: '#4c2859',
    description: 'Bàn bida nỉ xanh chuẩn thi đấu, máy chơi game Arcade màu tím neon và khu giải trí kiểm thử QA.',
    targetX: 710,
    targetY: 405, // Đứng bên cạnh bàn bida cầm gậy cơ
  },
];
