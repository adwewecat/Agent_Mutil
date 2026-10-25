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
    floorColor: '#c8d4ec',
    description: 'Sàn gạch công sở nhạt, bàn cubicle 2 màn hình CAD, kệ tài liệu, Bonsai Nhật Bản trên đôn gỗ.',
    targetX: 125,
    targetY: 195, // Ngồi ghế xoay trước bàn thiết kế
  },
  {
    id: 'director_office',
    name: 'Phòng Giám Đốc & Executive Lounge (Dũng 1)',
    x: 330,
    y: 80,
    width: 320,
    height: 195,
    color: '#0f172a',
    floorColor: '#15803d',
    description: 'Thảm sọc xanh ngọc bích, bộ sofa nỉ Royal Blue kèm gối cam rực rỡ, bàn trà hoa quả và tủ kính sách chuẩn Pinterest Pin B.',
    targetX: 470,
    targetY: 130, // Ngồi trên sofa nỉ xanh tiếp khách
  },
  {
    id: 'kitchen_pantry',
    name: 'Khu Cà Phê & Bếp Pantry',
    x: 670,
    y: 80,
    width: 260,
    height: 195,
    color: '#0f172a',
    floorColor: '#f1f5f9',
    description: 'Gạch men trắng ceramic, quầy bar inox, tủ lạnh có lò vi sóng trên nóc, máy bán nước tự động và bình nước khoáng.',
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
    floorColor: '#c8d4ec',
    description: 'Trạm lập trình Fullstack cubicle, máy photocopy đa khay có thùng rác tái chế, khay tài liệu và ghế xoay công thái học.',
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
    floorColor: '#1e3a5f',
    description: 'Thảm hội nghị Navy cao cấp, bàn họp gỗ óc chó, 4 ghế xoay nỉ xanh, laptop điều hành và bảng kính kiến trúc.',
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
    floorColor: '#4a2559',
    description: 'Bàn bida nỉ xanh chuẩn thi đấu, máy chơi game Arcade màu tím neon và cây cảnh cầu tròn Topiary.',
    targetX: 710,
    targetY: 405, // Đứng bên cạnh bàn bida cầm gậy cơ
  },
];
