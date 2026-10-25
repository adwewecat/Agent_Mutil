/**
 * Bộ dựng đồ họa Pixel Art cho đồ đạc nội thất và 4 Nhân vật Dũng
 */

import { Agent } from '../types';
import { ROOMS } from './mapData';

export class SpriteRenderer {
  /**
   * Vẽ toàn bộ phòng, sàn nhà và tường ngăn cách phong cách Pixel Art
   */
  public static drawMap(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // 1. Nền tổng thể văn phòng
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // 2. Vẽ từng phòng
    ROOMS.forEach(room => {
      // Sàn nhà
      ctx.fillStyle = room.floorColor;
      ctx.fillRect(room.x, room.y, room.width, room.height);

      // Lưới gạch Pixel (Floor Tiles)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const tileSize = 24;
      for (let tx = room.x; tx < room.x + room.width; tx += tileSize) {
        ctx.beginPath();
        ctx.moveTo(tx, room.y);
        ctx.lineTo(tx, room.y + room.height);
        ctx.stroke();
      }
      for (let ty = room.y; ty < room.y + room.height; ty += tileSize) {
        ctx.beginPath();
        ctx.moveTo(room.x, ty);
        ctx.lineTo(room.x + room.width, ty);
        ctx.stroke();
      }

      // Viền tường phòng (Wall Borders)
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.strokeRect(room.x, room.y, room.width, room.height);

      // Nẹp tường nổi khối pixel
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(room.x, room.y, room.width, 10);

      // Biển tên phòng phong cách LED / Pixel Badge
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(room.x + 8, room.y + 12, room.name.length * 7.5 + 16, 20);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.strokeRect(room.x + 8, room.y + 12, room.name.length * 7.5 + 16, 20);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(room.name, room.x + 14, room.y + 26);
    });

    // 3. Vẽ nội thất từng phòng
    this.drawFurniture(ctx);
  }

  /**
   * Vẽ đồ đạc nội thất chi tiết (Bàn, ghế, máy tính, bảng vẽ, bàn họp, máy arcade)
   */
  private static drawFurniture(ctx: CanvasRenderingContext2D) {
    // --- PHÒNG GIÁM ĐỐC (Dũng 1) ---
    // Bàn làm việc gỗ sang trọng
    ctx.fillStyle = '#78350f';
    ctx.fillRect(90, 110, 80, 40);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(92, 112, 76, 8);
    // Laptop giám đốc
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(115, 118, 26, 16);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(117, 120, 22, 12);
    // Ghế da giám đốc
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(118, 90, 22, 18);
    // Chậu cây phong thủy pixel
    this.drawPixelPlant(ctx, 40, 50);

    // --- PHÒNG KIẾN TRÚC SƯ (Dũng 2) ---
    // Bàn thiết kế kiến trúc
    ctx.fillStyle = '#475569';
    ctx.fillRect(320, 110, 80, 40);
    // Bản vẽ kiến trúc Blueprint mở rộng
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(330, 116, 40, 24);
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 1;
    ctx.strokeRect(332, 118, 36, 20);
    // Tủ Server Rack
    this.drawServerRack(ctx, 420, 45);

    // --- PHÒNG HỌP CHIẾN LƯỢC (Boardroom) ---
    // Bàn họp tròn dài gỗ Mahogany
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.roundRect(550, 95, 320, 80, 16);
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.stroke();
    // Máy chiếu trung tâm bàn họp
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(690, 125, 40, 22);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(710, 136, 6, 0, Math.PI * 2);
    ctx.fill();
    // Ghế họp bao quanh
    const chairX = [580, 640, 700, 760, 820];
    chairX.forEach(x => {
      // Ghế hàng trên
      ctx.fillStyle = '#334155';
      ctx.fillRect(x, 70, 20, 18);
      // Ghế hàng dưới
      ctx.fillRect(x, 185, 20, 18);
    });

    // --- PHÒNG LẬP TRÌNH (Dũng 3) ---
    // Bàn Lập trình góc chữ L hiện đại
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(140, 360, 90, 45);
    // 3 Màn hình lập trình hiển thị Matrix Code
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(145, 365, 24, 16);
    ctx.fillRect(173, 365, 26, 16);
    ctx.fillRect(203, 365, 22, 16);
    ctx.fillStyle = '#22c55e'; // Code xanh lá
    ctx.fillRect(147, 367, 20, 12);
    ctx.fillRect(175, 367, 22, 12);
    ctx.fillRect(205, 367, 18, 12);
    // Bàn phím cơ RGB
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(165, 386, 36, 8);

    // --- PHÒNG KIỂM THỬ (Dũng 4) ---
    // Bàn kiểm thử & An ninh
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(460, 360, 90, 45);
    // Màn hình Radar & Bug Matrix đỏ
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(470, 365, 40, 20);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(473, 368, 34, 14);
    // Radar scan quét
    ctx.strokeStyle = '#fca5a5';
    ctx.beginPath();
    ctx.arc(490, 375, 5, 0, Math.PI * 2);
    ctx.stroke();

    // --- KHU VỰC CÀ PHÊ & ARCADE (Lounge) ---
    // Máy trò chơi Arcade Retro
    this.drawArcadeMachine(ctx, 700, 310);
    // Quầy pha chế cà phê Espresso
    ctx.fillStyle = '#475569';
    ctx.fillRect(820, 330, 80, 35);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(840, 315, 24, 16);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(870, 318, 14, 12);
    // Sofa thư giãn
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(720, 440, 110, 40);
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(720, 425, 110, 16);
  }

  /**
   * Vẽ chậu cây cảnh Pixel Art
   */
  private static drawPixelPlant(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x + 4, y + 16, 16, 14);
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(x, y + 4, 24, 14);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(x + 4, y, 16, 8);
  }

  /**
   * Vẽ Tủ Server Rack phòng Kiến trúc sư
   */
  private static drawServerRack(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#090d16';
    ctx.fillRect(x, y, 36, 70);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(x, y, 36, 70);
    // Đèn LED nhấp nháy trên server
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#22c55e' : '#38bdf8';
      ctx.fillRect(x + 6, y + 10 + i * 9, 5, 4);
      ctx.fillStyle = '#475569';
      ctx.fillRect(x + 15, y + 10 + i * 9, 15, 4);
    }
  }

  /**
   * Vẽ Máy chơi game Arcade Retro
   */
  private static drawArcadeMachine(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(x, y, 34, 60);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 4, y + 8, 26, 20);
    // Màn hình game pixel 8-bit
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(x + 6, y + 10, 22, 16);
    // Nút bấm & Joystick
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(x + 12, y + 36, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(x + 22, y + 36, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Vẽ Nhân vật Pixel Art cho 4 Dũng kèm animation chân, gõ phím và bóng hội thoại
   */
  public static drawAgent(ctx: CanvasRenderingContext2D, agent: Agent, frame: number) {
    const x = agent.pos_x;
    const y = agent.pos_y;
    const isMoving = agent.status === 'moving';
    const isWorking = agent.status === 'coding' || agent.status === 'testing' || agent.status === 'debating';

    // Tính nhịp bước chân (Bobbing effect)
    const legOffset = isMoving ? Math.sin(frame * 0.25) * 4 : 0;
    const bodyOffset = isMoving ? Math.abs(Math.sin(frame * 0.25)) * 2 : 0;

    ctx.save();

    // 1. Bóng dưới chân (Drop Shadow)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x, y + 14, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Chân và Giày Pixel
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 6, y + 6 - legOffset, 4, 8 + legOffset); // Chân trái
    ctx.fillRect(x + 2, y + 6 + legOffset, 4, 8 - legOffset); // Chân phải

    // 3. Thân áo (Đặc trưng cho từng Dũng)
    const charY = y - bodyOffset;
    if (agent.code === 'dung_1') {
      // Dũng 1: Áo vest Giám đốc xanh navy lịch lãm + Cà vạt xanh dương
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(x - 9, charY - 8, 18, 15);
      ctx.fillStyle = '#38bdf8'; // Cà vạt
      ctx.fillRect(x - 1, charY - 6, 3, 9);
    } else if (agent.code === 'dung_2') {
      // Dũng 2: Áo gile tím đậm phong thái Kiến trúc sư 40 năm kinh nghiệm
      ctx.fillStyle = '#4c1d95';
      ctx.fillRect(x - 9, charY - 8, 18, 15);
      ctx.fillStyle = '#c084fc'; // Cổ áo sơ mi
      ctx.fillRect(x - 3, charY - 8, 6, 4);
    } else if (agent.code === 'dung_3') {
      // Dũng 3: Áo Hoodie xanh lá của Fullstack Hacker 40 năm
      ctx.fillStyle = '#065f46';
      ctx.fillRect(x - 9, charY - 8, 18, 15);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x - 4, charY - 4, 8, 6);
    } else {
      // Dũng 4: Áo khoác an ninh đỏ của Test Engineer 40 năm
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(x - 9, charY - 8, 18, 15);
      ctx.fillStyle = '#f87171';
      ctx.fillRect(x - 5, charY - 5, 4, 4);
    }

    // 4. Cánh tay & Bàn tay
    ctx.fillStyle = '#fbcfe8'; // Da tay
    if (isWorking && (agent.status === 'coding' || agent.status === 'testing')) {
      // Tay gõ bàn phím nhịp nhàng
      const armAnim = Math.sin(frame * 0.4) * 3;
      ctx.fillRect(x - 12, charY - 4 + armAnim, 4, 8);
      ctx.fillRect(x + 8, charY - 4 - armAnim, 4, 8);
    } else {
      ctx.fillRect(x - 12, charY - 4, 3, 10);
      ctx.fillRect(x + 9, charY - 4, 3, 10);
    }

    // 5. Khuôn mặt Pixel
    ctx.fillStyle = '#fbcfe8'; // Màu da mặt
    ctx.fillRect(x - 7, charY - 21, 14, 13);

    // 6. Tóc & Đặc điểm nhận diện
    if (agent.code === 'dung_1') {
      // Tóc đen vuốt gọn gàng
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x - 8, charY - 25, 16, 6);
      ctx.fillRect(x - 8, charY - 21, 3, 6);
    } else if (agent.code === 'dung_2') {
      // Tóc muối tiêu bạc (40 năm kinh nghiệm) + Kính mắt vàng
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x - 8, charY - 25, 16, 6);
      ctx.fillStyle = '#fde047'; // Gọng kính
      ctx.strokeRect(x - 6, charY - 17, 12, 3);
    } else if (agent.code === 'dung_3') {
      // Tai nghe chụp tai Gaming/Coding qua đầu
      ctx.fillStyle = '#334155';
      ctx.fillRect(x - 8, charY - 25, 16, 5);
      ctx.fillStyle = '#38bdf8'; // Chụp tai 2 bên
      ctx.fillRect(x - 9, charY - 20, 3, 7);
      ctx.fillRect(x + 6, charY - 20, 3, 7);
    } else {
      // Mũ lưỡi trai an ninh / Tóc ngắn chuyên nghiệp
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(x - 8, charY - 25, 16, 5);
      ctx.fillRect(x - 10, charY - 22, 6, 2); // Vành mũ
    }

    // Mắt
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 4, charY - 16, 2, 2);
    ctx.fillRect(x + 2, charY - 16, 2, 2);

    // 7. Nhãn tên Agent trên đầu
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(x - 28, charY - 44, 56, 15);
    ctx.strokeStyle = agent.avatar_color;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 28, charY - 44, 56, 15);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(agent.name, x, charY - 33);

    // 8. Trạng thái hành động / Bubble
    if (agent.status === 'debating') {
      this.drawSpeechBubble(ctx, x, charY - 48, '💬 TRANH LUẬN');
    } else if (agent.status === 'coding') {
      this.drawSpeechBubble(ctx, x, charY - 48, '⚡ CLEAN CODE');
    } else if (agent.status === 'testing') {
      this.drawSpeechBubble(ctx, x, charY - 48, '🛡️ STRESS TEST');
    }

    ctx.restore();
  }

  /**
   * Vẽ bóng hội thoại Retro Pixel trên đầu Agent
   */
  private static drawSpeechBubble(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
    const w = text.length * 6.5 + 12;
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x - w / 2, y - 14, w, 14);
    ctx.strokeStyle = '#854d0e';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - w / 2, y - 14, w, 14);

    // Đuôi bóng hội thoại
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(x - 3, y);
    ctx.lineTo(x + 3, y);
    ctx.lineTo(x, y + 4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#713f12';
    ctx.font = 'bold 8px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y - 4);
  }

  /**
   * Lớp phủ hiệu ứng Camera an ninh (CCTV REC Overlay)
   */
  public static drawCameraOverlay(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    cameraName: string,
    showScanlines: boolean
  ) {
    ctx.save();

    // Điểm đỏ REC nhấp nháy
    const now = new Date();
    const isBlinking = Math.floor(now.getTime() / 600) % 2 === 0;

    if (isBlinking) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(40, 40, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('LIVE CCTV • REC', 55, 44);

    // Tên Camera và Giờ hệ thống
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`CAM: ${cameraName.toUpperCase()}`, 55, 62);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(now.toISOString().replace('T', ' ').substring(0, 19), width - 220, 44);

    // Khung ngắm góc camera (Corner Crosshairs)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 2;
    const len = 20;

    // Góc trên-trái
    ctx.beginPath();
    ctx.moveTo(15, 15 + len);
    ctx.lineTo(15, 15);
    ctx.lineTo(15 + len, 15);
    ctx.stroke();

    // Góc trên-phải
    ctx.beginPath();
    ctx.moveTo(width - 15 - len, 15);
    ctx.lineTo(width - 15, 15);
    ctx.lineTo(width - 15, 15 + len);
    ctx.stroke();

    // Góc dưới-trái
    ctx.beginPath();
    ctx.moveTo(15, height - 15 - len);
    ctx.lineTo(15, height - 15);
    ctx.lineTo(15 + len, height - 15);
    ctx.stroke();

    // Góc dưới-phải
    ctx.beginPath();
    ctx.moveTo(width - 15 - len, height - 15);
    ctx.lineTo(width - 15, height - 15);
    ctx.lineTo(width - 15, height - 15 - len);
    ctx.stroke();

    // Hiệu ứng Scanline CRT nếu được bật
    if (showScanlines) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1.5);
      }
    }

    ctx.restore();
  }
}
