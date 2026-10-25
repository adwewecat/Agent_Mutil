/**
 * Bản đồ quy hoạch phòng và nội thất văn phòng ảo Pixel Office
 * Kích thước chuẩn: 960x540
 */

import { OfficeRoom } from '../types';

export const OFFICE_WIDTH = 960;
export const OFFICE_HEIGHT = 540;

export const ROOMS: OfficeRoom[] = [
  {
    id: 'director_office',
    name: 'Phòng Giám đốc (Dũng 1)',
    x: 20,
    y: 20,
    width: 220,
    height: 230,
    color: '#1e293b',
    floorColor: '#283548',
    description: 'Văn phòng chỉ huy chiến lược, lập kế hoạch dự án.',
    targetX: 130,
    targetY: 135,
  },
  {
    id: 'architect_office',
    name: 'Phòng Kiến trúc sư & PM (Dũng 2)',
    x: 250,
    y: 20,
    width: 220,
    height: 230,
    color: '#1e293b',
    floorColor: '#2b3342',
    description: 'Khu vực thẩm định rủi ro, kiến trúc hệ thống 40 năm kinh nghiệm.',
    targetX: 360,
    targetY: 135,
  },
  {
    id: 'boardroom',
    name: 'Phòng Họp Chiến Lược (Boardroom)',
    x: 480,
    y: 20,
    width: 460,
    height: 230,
    color: '#1e293b',
    floorColor: '#332a42',
    description: 'Bàn tròn hội nghị nơi Dũng 1 và Dũng 2 thảo luận và chốt phương án tối ưu.',
    targetX: 710,
    targetY: 135,
  },
  {
    id: 'dev_lab',
    name: 'Phòng Lập trình Cấp cao (Dũng 3)',
    x: 20,
    y: 270,
    width: 320,
    height: 250,
    color: '#1e293b',
    floorColor: '#1d3b32',
    description: 'Trạm máy tính lập trình Fullstack, tối ưu thuật toán và Clean Code.',
    targetX: 180,
    targetY: 395,
  },
  {
    id: 'qa_lab',
    name: 'Phòng Kiểm thử & An ninh (Dũng 4)',
    x: 350,
    y: 270,
    width: 310,
    height: 250,
    color: '#1e293b',
    floorColor: '#3d2528',
    description: 'Trung tâm bắn phá Stress Test, Boundary Values & Security Audit.',
    targetX: 505,
    targetY: 395,
  },
  {
    id: 'lounge',
    name: 'Khu Cà phê & Thư giãn (Lounge & Arcade)',
    x: 670,
    y: 270,
    width: 270,
    height: 250,
    color: '#1e293b',
    floorColor: '#2e303b',
    description: 'Khu vực giải trí máy Arcade retro, quầy cà phê espresso.',
    targetX: 805,
    targetY: 395,
  },
];
