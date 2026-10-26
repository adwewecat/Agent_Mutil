/**
 * Bản đồ văn phòng ảo Pixel Office 4D Isometric chuẩn phong cách Pinterest Pin 412290540892514371
 * Kích thước chuẩn: 960x540 (Tỉ lệ 16:9 Pixel-Perfect)
 * Bố cục văn phòng mở (Open-Plan) với các cụm vách ngăn Cubicle, phân bổ đúng 7 chỗ ngồi công sở
 */

import { OfficeRoom } from '../types';

export const OFFICE_WIDTH = 960;
export const OFFICE_HEIGHT = 540;

export const ROOMS: OfficeRoom[] = [
  {
    id: 'director_office',
    name: 'Executive Lounge & Director Hub (Dũng 1)',
    x: 30,
    y: 80,
    width: 280,
    height: 215,
    color: '#0f172a',
    floorColor: '#15803d',
    description: 'Thảm sọc xanh ngọc bích, sofa góc Royal Blue, bàn trà hoa quả tươi, tủ kính hồ sơ và cây Topiary (Chỗ 1/7).',
    targetX: 142,
    targetY: 142, // Ngồi trên sofa nỉ Royal Blue làm việc
  },
  {
    id: 'architect_office',
    name: 'Cubicle Kiến Trúc Sư & PM (Dũng 2)',
    x: 325,
    y: 80,
    width: 300,
    height: 215,
    color: '#0f172a',
    floorColor: '#c8d4ec',
    description: 'Bàn cubicle CAD kiến trúc, 2 màn hình thiết kế, thước chữ T, bản vẽ và ghế xoay nỉ xanh (Chỗ 2/7).',
    targetX: 415,
    targetY: 195, // Ngồi ghế xoay trước màn hình CAD
  },
  {
    id: 'games_room',
    name: 'Cubicle QA & Security Lead (Dũng 4)',
    x: 640,
    y: 80,
    width: 290,
    height: 215,
    color: '#0f172a',
    floorColor: '#c8d4ec',
    description: 'Trạm kiểm thử cubicle hiện đại, Dashboard Stress Test, tablet chẩn đoán an ninh và ghế xoay nỉ xanh (Chỗ 4/7).',
    targetX: 740,
    targetY: 195, // Ngồi ghế xoay trước màn hình QA
  },
  {
    id: 'kitchen_pantry',
    name: 'Khu Hậu Cần, Máy In & Nước Uống',
    x: 30,
    y: 310,
    width: 280,
    height: 200,
    color: '#0f172a',
    floorColor: '#f1f5f9',
    description: 'Máy photocopy đa khay có thùng rác tái chế, bình nước nóng lạnh úp bình xanh và quầy cà phê espresso.',
    targetX: 160,
    targetY: 375, // Đi giải lao lấy nước / cà phê
  },
  {
    id: 'dev_lab',
    name: 'Dev Lab & Workstations (Dũng 3)',
    x: 325,
    y: 310,
    width: 300,
    height: 200,
    color: '#0f172a',
    floorColor: '#c8d4ec',
    description: 'Trạm lập trình Fullstack Dev với 2 màn hình code ma trận, phím cơ, cốc cà phê Dev Fuel và bàn Peer Dev (Chỗ 3/7 & 5/7).',
    targetX: 415,
    targetY: 400, // Ngồi ghế xoay trước máy tính code
  },
  {
    id: 'boardroom',
    name: 'Khu Thảo Luận & Review Chiến Lược',
    x: 640,
    y: 310,
    width: 290,
    height: 200,
    color: '#0f172a',
    floorColor: '#1e3a5f',
    description: 'Bàn làm việc thảo luận đa năng, khay tài liệu in/out, ghế xoay nỉ xanh công sở (Chỗ 6/7 & 7/7).',
    targetX: 740,
    targetY: 410, // Ngồi ghế xoay thảo luận
  },
];
