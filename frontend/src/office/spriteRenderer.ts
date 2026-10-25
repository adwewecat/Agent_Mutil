/**
 * Bộ dựng đồ họa Pixel Art 2.5D Isometric chuẩn phong cách The Pixel Office & Agent-Pixels
 * Tối ưu hóa không gian văn phòng thống nhất, không chồng chéo vật trang trí, Z-Depth sorting hoàn hảo
 */

import { Agent } from '../types';
import { ROOMS } from './mapData';

// Interface cho các thực thể có thể vẽ và sắp xếp theo trục Z (chiều sâu Y)
export interface ZDrawable {
  zY: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export class SpriteRenderer {
  /**
   * 1. Dựng nền tổng thể và kiến trúc văn phòng (Sàn nhà, Tường 3D, Cửa sổ kính, Vách ngăn phòng)
   */
  public static drawOfficeStructure(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Nền không gian tối bao quanh văn phòng
    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, width, height);

    // Tường hậu phía sau văn phòng (Back Wall cao 80px có chiều sâu 3D Isometric)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, 20, width - 40, 60);

    // Gờ phào chỉ trần nhà phát sáng viền gỗ
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, 20, width - 40, 6);
    ctx.fillStyle = '#334155';
    ctx.fillRect(20, 26, width - 40, 2);

    // Các cửa sổ kính lớn Isometric (Windows) chiếu ánh sáng thành phố hoặc ánh sao đêm
    const windows = [120, 280, 480, 680, 840];
    windows.forEach(wx => {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(wx, 34, 48, 36);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(wx + 2, 36, 44, 32);

      // Nan cửa sổ
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(wx + 22, 34, 4, 36);
      ctx.fillRect(wx, 50, 48, 4);

      // Ánh sáng chiếu nghiêng xuống sàn
      ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.beginPath();
      ctx.moveTo(wx, 70);
      ctx.lineTo(wx + 48, 70);
      ctx.lineTo(wx + 70, 140);
      ctx.lineTo(wx - 20, 140);
      ctx.closePath();
      ctx.fill();
    });

    // Hành lang trung tâm lát gạch caro đen trắng (Checkerboard Hallway) nối giữa 2 dãy phòng
    this.drawCheckerboardHallway(ctx, 20, 275, width - 40, 40);

    // Sàn từng phòng chức năng
    ROOMS.forEach(room => {
      ctx.save();
      if (room.id === 'architect_office') {
        // Sàn gỗ sồi ấm áp phòng Kiến trúc
        this.drawParquetFloor(ctx, room.x, room.y, room.width, room.height);
      } else if (room.id === 'director_office') {
        // Thảm sapphire phòng Giám đốc
        this.drawSapphireCarpet(ctx, room.x, room.y, room.width, room.height);
      } else if (room.id === 'kitchen_pantry') {
        // Gạch men trắng ceramic nhà bếp
        this.drawCeramicFloor(ctx, room.x, room.y, room.width, room.height);
      } else if (room.id === 'dev_lab') {
        // Sàn gỗ parquet công nghệ phòng Dev
        this.drawParquetFloor(ctx, room.x, room.y, room.width, room.height);
      } else if (room.id === 'boardroom') {
        // Thảm xanh ngọc thạch phòng họp
        this.drawTealCarpet(ctx, room.x, room.y, room.width, room.height);
      } else if (room.id === 'games_room') {
        // Gạch hoa văn tím phòng bida
        this.drawLavenderTiles(ctx, room.x, room.y, room.width, room.height);
      }

      // Vách ngăn lửng kính mờ 2.5D giữa các phòng (Low Glass Partitions - không chắn tầm nhìn)
      this.drawRoomPartition(ctx, room.x, room.y, room.width, room.height);

      // Biển LED tên phòng kiểu Pixel Art
      this.drawRoomBadge(ctx, room.name, room.x, room.y);

      ctx.restore();
    });

    // Hệ thống đèn trần hình nón công nghiệp phong cách Fallout Shelter Vault
    this.drawVaultIndustrialLighting(ctx);

    // Tường bao quanh toàn bộ văn phòng bên ngoài
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, width - 40, height - 40);
  }

  /**
   * Hệ thống đèn trần hình nón công nghiệp phong cách Fallout Shelter Vault
   */
  public static drawVaultIndustrialLighting(ctx: CanvasRenderingContext2D) {
    const lights = [
      { x: 135, y: 315, floorY: 425, color: 'rgba(56, 189, 248, 0.08)', radius: 75 }, // Dev Lab (Cyan Matrix)
      { x: 490, y: 315, floorY: 430, color: 'rgba(254, 240, 138, 0.10)', radius: 100 }, // Boardroom (Warm Golden)
      { x: 800, y: 315, floorY: 430, color: 'rgba(168, 85, 247, 0.08)', radius: 85 },  // Games Room (Arcade Purple)
      { x: 135, y: 80,  floorY: 185, color: 'rgba(56, 189, 248, 0.08)', radius: 75 },  // Architect Office (Drafting Lamp)
      { x: 470, y: 80,  floorY: 175, color: 'rgba(251, 191, 36, 0.09)', radius: 90 },  // Director Office (Luxury Amber)
    ];

    lights.forEach(light => {
      // Dây cáp treo đen
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(light.x - 1, light.y - 25, 2, 25);

      // Chao đèn kim loại công nghiệp (Industrial Metal Lamp Shade)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(light.x - 10, light.y);
      ctx.lineTo(light.x + 10, light.y);
      ctx.lineTo(light.x + 5, light.y - 7);
      ctx.lineTo(light.x - 5, light.y - 7);
      ctx.closePath();
      ctx.fill();

      // Bóng đèn phát sáng
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(light.x, light.y + 1, 3, 0, Math.PI * 2);
      ctx.fill();

      // Luồng sáng hình nón chiếu rọi xuống sàn (Conical Spotlight Beam)
      const grad = ctx.createLinearGradient(light.x, light.y, light.x, light.floorY);
      grad.addColorStop(0, light.color);
      grad.addColorStop(0.7, light.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(light.x - 5, light.y + 3);
      ctx.lineTo(light.x + 5, light.y + 3);
      ctx.lineTo(light.x + light.radius, light.floorY);
      ctx.lineTo(light.x - light.radius, light.floorY);
      ctx.closePath();
      ctx.fill();
    });
  }

  /**
   * Khói bốc lên từ tách cà phê nóng (Coffee Steam Effect - Fallout Shelter style)
   */
  public static drawCoffeeSteam(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const time = Date.now() / 250;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 2; i++) {
      const offsetX = Math.sin(time + i * 2) * 2;
      const offsetY = ((time * 4 + i * 8) % 14);
      ctx.beginPath();
      ctx.moveTo(x + i * 3, y - 1);
      ctx.quadraticCurveTo(x + i * 3 + offsetX, y - 5 - offsetY, x + i * 3, y - 10 - offsetY);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Vẽ hành lang gạch caro đen trắng (Checkerboard Hallway)
   */
  private static drawCheckerboardHallway(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    const sz = 20;
    for (let px = x; px < x + w; px += sz) {
      for (let py = y; py < y + h; py += sz) {
        const isWhite = (Math.floor(px / sz) + Math.floor(py / sz)) % 2 === 0;
        ctx.fillStyle = isWhite ? '#334155' : '#1e293b';
        ctx.fillRect(px, py, sz, sz);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(px, py, sz, sz);
      }
    }
  }

  /**
   * Sàn gỗ sồi Parquet vân gỗ ấm áp
   */
  private static drawParquetFloor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.fillStyle = '#452b14';
    ctx.fillRect(x, y, w, h);
    const plankH = 15;
    const plankW = 40;
    for (let py = y; py < y + h; py += plankH) {
      const rowIdx = Math.floor((py - y) / plankH);
      const offset = (rowIdx % 2) * (plankW / 2);
      for (let px = x - offset; px < x + w; px += plankW) {
        ctx.fillStyle = (rowIdx + Math.floor(px / plankW)) % 2 === 0 ? '#543519' : '#452b14';
        ctx.fillRect(Math.max(x, px), py, Math.min(plankW, x + w - px), plankH);
        ctx.strokeStyle = 'rgba(20, 10, 5, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(Math.max(x, px), py, Math.min(plankW, x + w - px), plankH);
      }
    }
  }

  /**
   * Thảm sapphire phòng Giám đốc
   */
  private static drawSapphireCarpet(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.fillStyle = '#1e3a5f';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 6, y + 6, w - 12, h - 12);
    // Họa tiết dệt ô vuông thảm
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    const sz = 20;
    for (let px = x; px < x + w; px += sz) {
      ctx.beginPath();
      ctx.moveTo(px, y);
      ctx.lineTo(px, y + h);
      ctx.stroke();
    }
    for (let py = y; py < y + h; py += sz) {
      ctx.beginPath();
      ctx.moveTo(x, py);
      ctx.lineTo(x + w, py);
      ctx.stroke();
    }
  }

  /**
   * Sàn gạch men trắng ceramic bóng bẩy khu bếp pantry
   */
  private static drawCeramicFloor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    const sz = 24;
    for (let px = x; px < x + w; px += sz) {
      ctx.beginPath();
      ctx.moveTo(px, y);
      ctx.lineTo(px, y + h);
      ctx.stroke();
    }
    for (let py = y; py < y + h; py += sz) {
      ctx.beginPath();
      ctx.moveTo(x, py);
      ctx.lineTo(x + w, py);
      ctx.stroke();
    }
  }

  /**
   * Thảm xanh ngọc thạch phòng họp hội nghị
   */
  private static drawTealCarpet(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.fillStyle = '#164e63';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#0891b2';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 6, y + 6, w - 12, h - 12);
    // Viền chỉ thảm tinh tế
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.strokeRect(x + 10, y + 10, w - 20, h - 20);
  }

  /**
   * Gạch hoa văn tím phòng bida & giải trí
   */
  private static drawLavenderTiles(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.fillStyle = '#4a2559';
    ctx.fillRect(x, y, w, h);
    const sz = 24;
    for (let px = x; px < x + w; px += sz) {
      for (let py = y; py < y + h; py += sz) {
        ctx.fillStyle = (Math.floor(px / sz) + Math.floor(py / sz)) % 2 === 0 ? '#582d6b' : '#3f1f4c';
        ctx.fillRect(px, py, sz, sz);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.strokeRect(px, py, sz, sz);
      }
    }
  }

  /**
   * Vách ngăn lửng kính mờ 2.5D giữa các phòng (Partition Dividers)
   */
  private static drawRoomPartition(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    // Viền khung nhôm đen phía dưới
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Cửa ra vào phòng rộng mở 44px
    const doorW = 44;
    const doorX = x + w / 2 - doorW / 2;
    ctx.clearRect(doorX, y + h - 2, doorW, 4);
    ctx.fillStyle = '#92400e'; // Ngưỡng cửa gỗ
    ctx.fillRect(doorX, y + h - 2, doorW, 3);
  }

  /**
   * Biển LED tên phòng kiểu Pixel Art
   */
  private static drawRoomBadge(ctx: CanvasRenderingContext2D, name: string, x: number, y: number) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(x + 8, y + 8, name.length * 7 + 14, 16);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 8, y + 8, name.length * 7 + 14, 16);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
    ctx.fillText(name, x + 14, y + 20);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 2. DANH MỤC NỘI THẤT CHUẨN XÁC, KHÔNG CHỒNG CHÉO (Z-SORTED FURNITURE)
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Tạo danh sách toàn bộ vật phẩm nội thất với toạ độ Z-Depth chuẩn xác
   */
  public static getFurnitureDrawables(): ZDrawable[] {
    const drawables: ZDrawable[] = [];

    // ───────────────────────────────────────────────────────────────────────
    // 1. PHÒNG KIẾN TRÚC SƯ DŨNG 2 (x: 30, y: 80, w: 280, h: 195)
    // ───────────────────────────────────────────────────────────────────────
    // Kệ sách kỹ thuật sát tường sau
    drawables.push({
      zY: 105,
      draw: ctx => this.drawBookshelf(ctx, 45, 60),
    });
    // Mini Server Rack đèn LED
    drawables.push({
      zY: 110,
      draw: ctx => this.drawServerRack(ctx, 235, 55),
    });
    // Cây cảnh góc phòng
    drawables.push({
      zY: 115,
      draw: ctx => this.drawPottedPlant(ctx, 275, 85),
    });
    // Bàn làm việc kiến trúc sư (màn hình, bản vẽ)
    drawables.push({
      zY: 175,
      draw: ctx => this.drawArchitectDesk(ctx, 80, 140),
    });

    // ───────────────────────────────────────────────────────────────────────
    // 2. PHÒNG GIÁM ĐỐC DŨNG 1 (x: 330, y: 80, w: 320, h: 195)
    // ───────────────────────────────────────────────────────────────────────
    // Tranh nghệ thuật treo tường sau
    drawables.push({
      zY: 65,
      draw: ctx => this.drawWallArt(ctx, 450, 35, 60, 22, '#0284c7'),
    });
    // Chậu cây ficus tán rộng góc trái
    drawables.push({
      zY: 115,
      draw: ctx => this.drawPottedPlant(ctx, 350, 85),
    });
    // Chậu cây ficus góc phải
    drawables.push({
      zY: 115,
      draw: ctx => this.drawPottedPlant(ctx, 615, 85),
    });
    // Sofa dài da đỏ sang trọng (Đệm ngồi ở y = 120-135)
    drawables.push({
      zY: 140,
      draw: ctx => this.drawLuxuryRedSofa(ctx, 410, 105, 120, 36),
    });
    // Bàn trà tiếp khách với 2 tách cà phê (nằm phía trước sofa)
    drawables.push({
      zY: 175,
      draw: ctx => this.drawCoffeeTable(ctx, 440, 155),
    });

    // ───────────────────────────────────────────────────────────────────────
    // 3. KHU BẾP & PANTRY (x: 670, y: 80, w: 260, h: 195)
    // ───────────────────────────────────────────────────────────────────────
    // Đồng hồ tròn treo tường
    drawables.push({
      zY: 55,
      draw: ctx => this.drawWallClock(ctx, 770, 45),
    });
    // Tủ lạnh 2 cánh
    drawables.push({
      zY: 135,
      draw: ctx => this.drawRefrigerator(ctx, 825, 82),
    });
    // Máy bán nước tự động
    drawables.push({
      zY: 135,
      draw: ctx => this.drawVendingMachine(ctx, 875, 82),
    });
    // Bình nước nóng lạnh
    drawables.push({
      zY: 130,
      draw: ctx => this.drawWaterDispenser(ctx, 685, 88),
    });
    // Quầy bếp & bồn rửa inox
    drawables.push({
      zY: 145,
      draw: ctx => this.drawKitchenCounter(ctx, 720, 92),
    });
    // Cây xanh góc bếp
    drawables.push({
      zY: 190,
      draw: ctx => this.drawPottedPlant(ctx, 900, 160),
    });

    // ───────────────────────────────────────────────────────────────────────
    // 4. PHÒNG DEV LAB DŨNG 3 (x: 30, y: 315, w: 290, h: 195)
    // ───────────────────────────────────────────────────────────────────────
    // Tủ sách tài liệu dev
    drawables.push({
      zY: 345,
      draw: ctx => this.drawBookshelf(ctx, 45, 318),
    });
    // Bàn làm việc Fullstack Dev với 2 màn hình code matrix xanh lá
    drawables.push({
      zY: 395,
      draw: ctx => this.drawDevWorkstation(ctx, 85, 355),
    });
    // Thùng rác inox công nghệ
    drawables.push({
      zY: 410,
      draw: ctx => this.drawTrashBin(ctx, 205, 395),
    });
    // Chậu cây góc phòng dev
    drawables.push({
      zY: 470,
      draw: ctx => this.drawPottedPlant(ctx, 275, 455),
    });

    // ───────────────────────────────────────────────────────────────────────
    // 5. PHÒNG HỌP CHIẾN LƯỢC BOARDROOM (x: 340, y: 315, w: 310, h: 195)
    // ───────────────────────────────────────────────────────────────────────
    // Bảng trắng kiến trúc lớn treo tường
    drawables.push({
      zY: 345,
      draw: ctx => this.drawWhiteboard(ctx, 440, 318),
    });
    // 2 Ghế họp DÃY TRÊN (nằm sau bàn họp: y = 350)
    drawables.push({
      zY: 360,
      draw: ctx => {
        this.drawConferenceChair(ctx, 445, 348);
        this.drawConferenceChair(ctx, 525, 348);
      },
    });
    // Bàn họp hội đồng lớn bằng gỗ óc chó (Conference Table, Laptop, Bình hoa)
    drawables.push({
      zY: 425,
      draw: ctx => this.drawConferenceTableSurface(ctx, 395, 365),
    });
    // 2 Ghế họp DÃY DƯỚI (nằm trước bàn họp: y = 435)
    drawables.push({
      zY: 450,
      draw: ctx => {
        this.drawConferenceChair(ctx, 445, 435);
        this.drawConferenceChair(ctx, 525, 435);
      },
    });

    // ───────────────────────────────────────────────────────────────────────
    // 6. PHÒNG BIDA & GAMES ROOM DŨNG 4 (x: 670, y: 315, w: 260, h: 195)
    // ───────────────────────────────────────────────────────────────────────
    // Máy chơi game Arcade Retro màu tím neon
    drawables.push({
      zY: 375,
      draw: ctx => this.drawArcadeCabinet(ctx, 875, 320),
    });
    // Bàn Bida nỉ xanh chuẩn thi đấu
    drawables.push({
      zY: 435,
      draw: ctx => this.drawBilliardTable(ctx, 730, 365),
    });
    // Ghế sofa dài thư giãn phía dưới
    drawables.push({
      zY: 485,
      draw: ctx => this.drawLoungeBench(ctx, 745, 465),
    });

    return drawables;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CÁC HÀM DỰNG NỘI THẤT CHI TIẾT PIXEL ART
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Bàn bida nỉ xanh chuẩn thi đấu
   */
  private static drawBilliardTable(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 130;
    const h = 72;
    // Chân bàn gỗ bóng
    ctx.fillStyle = '#271206';
    ctx.fillRect(x + 10, y + h, 12, 16);
    ctx.fillRect(x + w - 22, y + h, 12, 16);

    // Thành bàn gỗ sồi
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 3, y + 3, w - 6, 6);

    // Mặt nỉ xanh chuẩn thi đấu
    ctx.fillStyle = '#15803d';
    ctx.fillRect(x + 10, y + 10, w - 20, h - 20);

    // 6 Lỗ bida (Pockets)
    ctx.fillStyle = '#0f172a';
    const pockets = [
      [x + 10, y + 10], [x + w / 2, y + 9], [x + w - 10, y + 10],
      [x + 10, y + h - 10], [x + w / 2, y + h - 9], [x + w - 10, y + h - 10],
    ];
    pockets.forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Các quả bi-a nhiều màu
    const balls = [
      { x: x + 40, y: y + 32, c: '#ef4444' },
      { x: x + 48, y: y + 38, c: '#eab308' },
      { x: x + 43, y: y + 44, c: '#3b82f6' },
      { x: x + 90, y: y + 34, c: '#f8fafc' }, // Bi cái
    ];
    balls.forEach(b => {
      ctx.fillStyle = b.c;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Gậy cơ bida bằng gỗ sồi đặt chéo
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 85, y + 38);
    ctx.lineTo(x + 55, y + 56);
    ctx.stroke();
  }

  /**
   * Bàn họp hội đồng lớn bằng gỗ óc chó (Conference Table Surface & Props)
   */
  private static drawConferenceTableSurface(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 190;
    const h = 65;

    // Mặt bàn gỗ óc chó bóng
    ctx.fillStyle = '#3b1807';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Mép bàn phản chiếu ánh sáng
    ctx.fillStyle = '#54230c';
    ctx.fillRect(x + 4, y + 3, w - 8, 4);

    // Laptop hội nghị mở sẵn với màn hình phát sáng
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + 150, y + 14, 20, 14);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 152, y + 16, 16, 10);

    // Khay tài liệu trung tâm
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 75, y + 20, 35, 14);
    // Bình hoa xanh
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(x + 92, y + 27, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Ghế xoay văn phòng họp nỉ xanh
   */
  private static drawConferenceChair(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#15803d';
    ctx.fillRect(x - 8, y, 16, 12);
    ctx.fillStyle = '#166534';
    ctx.fillRect(x - 6, y + 2, 12, 3);
  }

  /**
   * Bàn làm việc Fullstack Dev (2 màn hình LED matrix code xanh lá và khói cà phê nóng)
   */
  private static drawDevWorkstation(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 100;
    const h = 40;

    // Mặt bàn gỗ sồi
    ctx.fillStyle = '#5c2d13';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 2, y + 2, w - 4, 5);

    // Màn hình 1 (Chính) - Matrix code cuộn & con trỏ nhấp nháy
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 18, y - 19, 30, 21);
    ctx.fillStyle = '#052e16';
    ctx.fillRect(x + 20, y - 17, 26, 17);

    // Code lines matrix xanh lá
    const tick = Math.floor(Date.now() / 220) % 4;
    ctx.fillStyle = '#22c55e';
    for (let row = 0; row < 3; row++) {
      const lineLen = ((row + tick) % 3 + 1) * 6;
      ctx.fillRect(x + 22, y - 14 + row * 4, Math.min(22, lineLen), 2);
    }
    // Con trỏ nhấp nháy
    if (Math.floor(Date.now() / 350) % 2 === 0) {
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(x + 38, y - 6, 3, 3);
    }

    // Màn hình 2 (Phụ) - Biểu đồ kiến trúc / Network
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 52, y - 19, 28, 21);
    ctx.fillStyle = '#082f49';
    ctx.fillRect(x + 54, y - 17, 24, 17);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 56, y - 7, 4, 5);
    ctx.fillRect(x + 62, y - 11, 4, 9);
    ctx.fillRect(x + 68, y - 15, 4, 13);

    // Bàn phím cơ & Cốc cà phê đỏ có khói nóng
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 35, y + 14, 25, 7);
    ctx.fillStyle = '#ef4444'; // Cốc cà phê đỏ
    ctx.fillRect(x + 85, y + 10, 6, 8);
    this.drawCoffeeSteam(ctx, x + 88, y + 10);
  }

  /**
   * Bàn làm việc Kiến trúc sư (2 màn hình hiển thị blueprint và bản vẽ)
   */
  private static drawArchitectDesk(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const w = 90;
    const h = 38;

    ctx.fillStyle = '#5c2d13';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 2, y + 2, w - 4, 4);

    // Màn hình kiến trúc lớn
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 25, y - 19, 40, 21);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(x + 27, y - 17, 36, 17);

    // Sơ đồ khối kiến trúc trên màn hình
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(x + 30, y - 14, 8, 5);
    ctx.fillRect(x + 42, y - 14, 8, 5);
    ctx.fillRect(x + 54, y - 14, 6, 5);
    ctx.fillRect(x + 36, y - 6, 14, 4);

    // Bản vẽ blueprint xanh trên bàn
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(x + 10, y + 10, 24, 16);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x + 12, y + 12, 20, 12);
  }

  /**
   * Sofa dài da đỏ sang trọng phòng Giám đốc
   */
  private static drawLuxuryRedSofa(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    // Tựa lưng sofa
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(x, y, w, 14);
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(x + 2, y + 2, w - 4, 10);

    // Đệm ngồi sofa
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x, y + 14, w, h - 14);

    // Tay vịn 2 bên
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(x - 6, y + 6, 8, h - 6);
    ctx.fillRect(x + w - 2, y + 6, 8, h - 6);
  }

  /**
   * Bàn trà tiếp khách mặt gỗ sồi với 2 tách cà phê nóng
   */
  private static drawCoffeeTable(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x, y, 60, 24);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x + 2, y + 2, 56, 5);

    // 2 Tách cà phê trắng với khói nóng bốc lên
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x + 15, y + 9, 7, 6);
    ctx.fillRect(x + 38, y + 9, 7, 6);
    this.drawCoffeeSteam(ctx, x + 18, y + 9);
    this.drawCoffeeSteam(ctx, x + 41, y + 9);
  }

  /**
   * Kệ sách gỗ tài liệu
   */
  private static drawBookshelf(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x, y, 45, 42);
    ctx.fillStyle = '#78350f';
    ctx.strokeRect(x, y, 45, 42);

    // Sách màu sắc xếp trên kệ
    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#ec4899'];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 5; c++) {
        ctx.fillStyle = colors[(r * 5 + c) % colors.length];
        ctx.fillRect(x + 5 + c * 7, y + 6 + r * 18, 5, 12);
      }
    }
  }

  /**
   * Mini Server Rack đèn LED nhấp nháy
   */
  private static drawServerRack(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x, y, 30, 50);
    ctx.strokeStyle = '#475569';
    ctx.strokeRect(x, y, 30, 50);
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#22c55e' : '#38bdf8';
      ctx.fillRect(x + 4, y + 6 + i * 9, 3, 3);
      ctx.fillStyle = '#334155';
      ctx.fillRect(x + 10, y + 6 + i * 9, 15, 3);
    }
  }

  /**
   * Máy chơi game Arcade Retro màu tím neon
   */
  private static drawArcadeCabinet(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#581c87';
    ctx.fillRect(x, y, 34, 60);
    // Viền marquee
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(x + 4, y + 4, 26, 8);
    // Màn hình game pixel
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 4, y + 16, 26, 20);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(x + 8, y + 20, 6, 6);
    // Nút điều khiển
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(x + 12, y + 44, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Bảng trắng kiến trúc lớn
   */
  private static drawWhiteboard(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x, y, 100, 32);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, 100, 32);

    // Sơ đồ hộp và mũi tên
    ctx.strokeStyle = '#3b82f6';
    ctx.strokeRect(x + 8, y + 6, 18, 10);
    ctx.strokeStyle = '#10b981';
    ctx.strokeRect(x + 65, y + 6, 20, 10);
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(x + 26, y + 11);
    ctx.lineTo(x + 65, y + 11);
    ctx.stroke();
  }

  /**
   * Bình nước khoáng nóng lạnh
   */
  private static drawWaterDispenser(ctx: CanvasRenderingContext2D, x: number, y: number) {
    // Bình nước úp ngược
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(x + 9, y + 8, 7, 0, Math.PI * 2);
    ctx.fill();
    // Thân máy
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x + 2, y + 15, 14, 30);
    // 2 vòi
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + 4, y + 25, 3, 3);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(x + 10, y + 25, 3, 3);
  }

  /**
   * Máy bán nước tự động (Vending Machine)
   */
  private static drawVendingMachine(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#475569';
    ctx.fillRect(x, y, 32, 52);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 4, y + 6, 24, 26);
    // Lon nước
    const cans = ['#ef4444', '#22c55e', '#3b82f6'];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = cans[i];
      ctx.fillRect(x + 6 + i * 7, y + 12, 5, 8);
    }
    // Khe nhả
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 6, y + 40, 20, 6);
  }

  /**
   * Quầy bếp & Bồn rửa Inox
   */
  private static drawKitchenCounter(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x, y, 75, 36);
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(x, y, 75, 5); // Mặt đá bếp

    // Bồn rửa & vòi nước
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 10, y + 8, 20, 16);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(x + 12, y + 10, 16, 12);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x + 18, y + 3, 3, 7);
  }

  /**
   * Tủ lạnh 2 cánh
   */
  private static drawRefrigerator(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x, y, 28, 52);
    ctx.strokeStyle = '#94a3b8';
    ctx.strokeRect(x, y, 28, 52);
    ctx.beginPath();
    ctx.moveTo(x, y + 20);
    ctx.lineTo(x + 28, y + 20);
    ctx.stroke();
  }

  /**
   * Ghế dài nghỉ ngơi phòng bida
   */
  private static drawLoungeBench(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#581c87';
    ctx.fillRect(x, y, 80, 22);
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(x + 2, y + 2, 76, 5);
  }

  /**
   * Chậu cây xanh Monstera / Ficus
   */
  private static drawPottedPlant(ctx: CanvasRenderingContext2D, x: number, y: number) {
    // Chậu đất nung
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(x - 6, y + 8, 12, 12);
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(x - 7, y + 7, 14, 3);

    // Tán lá xanh bóng
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(x, y + 2, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(x - 2, y, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Tranh treo tường
   */
  private static drawWallArt(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string) {
    ctx.fillStyle = '#eab308'; // Khung vàng
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = c;
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  }

  /**
   * Đồng hồ tường
   */
  private static drawWallClock(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  /**
   * Thùng rác inox
   */
  private static drawTrashBin(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x, y, 12, 15);
    ctx.fillStyle = '#475569';
    ctx.fillRect(x, y, 12, 3);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 3. VẼ 4 DŨNG CHUẨN XÁC, ANIMATION ĐẸP, ĐÚNG TƯ THẾ LÀM VIỆC
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Vẽ Nhân vật Pixel Art cho 4 Dũng kèm animation chân, gõ phím, cầm gậy cơ, biểu cảm phong phú
   */
  public static drawAgent(ctx: CanvasRenderingContext2D, agent: Agent, frame: number) {
    const x = agent.pos_x;
    const y = agent.pos_y;
    const isMoving = agent.status === 'moving';

    // Animation bước chân 4 frame
    const walkCycle = Math.floor((frame / 8) % 4);
    const legOffset = isMoving ? (walkCycle === 0 ? -4 : walkCycle === 2 ? 4 : 0) : 0;
    const bodyBob = isMoving ? Math.abs(Math.sin(frame * 0.25)) * 2 : 0;
    const charY = y - bodyBob;

    ctx.save();

    // 1. Tựa ghế xoay văn phòng nếu Dũng 3 hoặc Dũng 2 đang ngồi làm việc
    if (!isMoving && agent.code === 'dung_3' && agent.current_room === 'dev_lab') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x - 11, charY - 12, 22, 16);
      ctx.fillStyle = '#334155';
      ctx.fillRect(x - 9, charY - 10, 18, 12);
    } else if (!isMoving && agent.code === 'dung_2' && agent.current_room === 'architect_office') {
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(x - 11, charY - 12, 22, 16);
    }

    // 2. Bóng đổ mềm mại dưới chân
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x, y + 16, 13, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Chân & Giày da
    ctx.fillStyle = '#0f172a';
    if (!isMoving && (agent.current_room === 'director_office' || agent.current_room === 'dev_lab')) {
      // Dáng ngồi: Chân gập ngắn
      ctx.fillRect(x - 6, charY + 8, 5, 6);
      ctx.fillRect(x + 1, charY + 8, 5, 6);
    } else {
      // Dáng đứng hoặc đi
      ctx.fillRect(x - 7, charY + 8 - legOffset, 5, 9 + legOffset);
      ctx.fillRect(x + 2, charY + 8 + legOffset, 5, 9 - legOffset);
    }

    // 4. Quần dài
    ctx.fillStyle = agent.code === 'dung_1' ? '#1e293b' : agent.code === 'dung_2' ? '#334155' : agent.code === 'dung_3' ? '#1e293b' : '#450a0a';
    ctx.fillRect(x - 8, charY + 3, 16, 7);

    // 5. Áo đặc trưng cho từng Dũng
    if (agent.code === 'dung_1') {
      // DŨNG 1: Vest xanh Navy + Cà vạt xanh
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(x - 10, charY - 11, 20, 16);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(x - 4, charY - 11, 8, 4);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(x - 1.5, charY - 9, 3, 11);
    } else if (agent.code === 'dung_2') {
      // DŨNG 2: Áo gile tím lịch lãm
      ctx.fillStyle = '#581c87';
      ctx.fillRect(x - 10, charY - 11, 20, 16);
      ctx.fillStyle = '#e9d5ff';
      ctx.fillRect(x - 4, charY - 11, 8, 4);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(x - 2, charY - 9, 4, 4);
    } else if (agent.code === 'dung_3') {
      // DŨNG 3: Hoodie xanh Hacker
      ctx.fillStyle = '#065f46';
      ctx.fillRect(x - 10, charY - 11, 20, 16);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x - 5, charY - 4, 10, 7);
    } else {
      // DŨNG 4: Áo khoác an ninh đỏ + Thẻ vàng
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(x - 10, charY - 11, 20, 16);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x - 6, charY - 7, 5, 5);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(x + 2, charY - 6, 4, 4);
    }

    // 6. Cánh tay & Hành động (Gõ bàn phím, vung tay khi đi, hoặc cầm gậy bida)
    ctx.fillStyle = '#fbcfe8';
    if (!isMoving && agent.code === 'dung_3' && agent.current_room === 'dev_lab') {
      // Gõ phím cơ liên tục
      const keyType = Math.sin(frame * 0.6) * 2;
      ctx.fillRect(x - 8, charY - 4 + keyType, 5, 7);
      ctx.fillRect(x + 3, charY - 4 - keyType, 5, 7);
    } else if (!isMoving && agent.code === 'dung_4' && agent.current_room === 'games_room') {
      // Cầm gậy cơ bida chĩa vào bàn bida
      ctx.fillRect(x - 8, charY - 2, 5, 6);
      ctx.fillRect(x + 4, charY - 4, 5, 6);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x - 10, charY + 6);
      ctx.lineTo(x + 26, charY - 6);
      ctx.stroke();
    } else if (isMoving) {
      ctx.fillRect(x - 13, charY - 7 - legOffset, 4, 10);
      ctx.fillRect(x + 9, charY - 7 + legOffset, 4, 10);
    } else {
      ctx.fillRect(x - 13, charY - 7, 4, 11);
      ctx.fillRect(x + 9, charY - 7, 4, 11);
    }

    // 7. Khuôn mặt Pixel
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 8, charY - 26, 16, 15);

    // 8. Mắt và Điểm sáng
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 5, charY - 20, 3, 3);
    ctx.fillRect(x + 2, charY - 20, 3, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 5, charY - 20, 1, 1);
    ctx.fillRect(x + 2, charY - 20, 1, 1);

    // 9. Tóc & Đặc điểm riêng biệt của 4 Dũng
    if (agent.code === 'dung_1') {
      ctx.fillStyle = '#090d16'; // Tóc đen phong độ
      ctx.fillRect(x - 9, charY - 30, 18, 7);
      ctx.fillRect(x - 10, charY - 26, 3, 8);
      ctx.fillRect(x + 7, charY - 26, 3, 6);
    } else if (agent.code === 'dung_2') {
      ctx.fillStyle = '#94a3b8'; // Tóc muối tiêu 40 năm KN
      ctx.fillRect(x - 9, charY - 30, 18, 7);
      ctx.fillRect(x - 10, charY - 26, 3, 8);
      ctx.fillRect(x + 7, charY - 26, 3, 8);
      // Kính gọng vàng
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x - 6, charY - 21, 5, 4);
      ctx.strokeRect(x + 1, charY - 21, 5, 4);
    } else if (agent.code === 'dung_3') {
      ctx.fillStyle = '#0f172a'; // Tóc nâu
      ctx.fillRect(x - 9, charY - 30, 18, 6);
      // Tai nghe Gaming / Coding cyan
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(x - 9, charY - 31, 18, 3);
      ctx.fillRect(x - 11, charY - 25, 4, 8);
      ctx.fillRect(x + 7, charY - 25, 4, 8);
    } else {
      // Mũ an ninh đỏ
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(x - 9, charY - 31, 18, 7);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x - 12, charY - 26, 8, 3);
    }

    // 10. Bảng tên Pixel nổi trên đầu
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(x - 28, charY - 50, 56, 16);
    ctx.strokeStyle = agent.avatar_color;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 28, charY - 50, 56, 16);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(agent.name, x, charY - 38);

    // 11. Bong bóng trạng thái động phong cách Fallout Shelter Vault Action Bubbles
    this.drawFalloutThoughtBubble(ctx, x, charY - 54, agent, frame);

    ctx.restore();
  }

  /**
   * Bong bóng hành động / suy nghĩ chuẩn phong cách Fallout Shelter Vault Action Bubbles
   */
  public static drawFalloutThoughtBubble(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    agent: Agent,
    frame: number
  ) {
    // Độ nhấp nhô nhẹ nhàng (Floating Bob)
    const bob = Math.sin(frame * 0.09) * 3;
    const bubbleY = y + bob;

    let text = '';
    let icon = '';
    let borderColor = '#38bdf8';
    let bgColor = 'rgba(15, 23, 42, 0.95)';
    let textColor = '#f8fafc';

    if (agent.status === 'debating') {
      if (agent.code === 'dung_1') {
        text = 'THỊ TRƯỜNG & VẬN HÀNH';
        icon = '🔍';
        borderColor = '#f59e0b';
        textColor = '#fef08a';
      } else {
        text = 'RỦI RO HỆ THỐNG & PM';
        icon = '⚙️';
        borderColor = '#c084fc';
        textColor = '#f3e8ff';
      }
    } else if (agent.status === 'coding') {
      text = 'CLEAN CODE & REST API';
      icon = '⚡';
      borderColor = '#10b981';
      textColor = '#6ee7b7';
    } else if (agent.status === 'testing') {
      text = 'STRESS TEST 5,000 TPS';
      icon = '🎯';
      borderColor = '#ef4444';
      textColor = '#fca5a5';
    } else if (agent.status === 'moving') {
      text = 'ĐANG BƯỚC ĐI...';
      icon = '🚶';
      borderColor = '#64748b';
      textColor = '#cbd5e1';
    } else {
      // Idle
      return;
    }

    const displayText = `${icon} ${text}`;
    const w = Math.min(220, displayText.length * 6.8 + 20);
    const h = 20;

    // 2 vòng tròn nối từ đầu nhân vật lên bong bóng (Fallout Shelter thought connectors)
    ctx.fillStyle = borderColor;
    ctx.beginPath();
    ctx.arc(x, bubbleY + 12, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + 2, bubbleY + 7, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Hộp bong bóng thoại bo góc mềm mại
    ctx.save();
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, bubbleY - h, w, h, 6);
    ctx.fill();

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, bubbleY - h, w, h, 6);
    ctx.stroke();

    // Icon & Text sắc nét
    ctx.fillStyle = textColor;
    ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(displayText, x, bubbleY - 6);
    ctx.restore();
  }

  /**
   * 4. Lớp phủ Camera an ninh (CCTV REC Overlay) chuẩn Agent-Pixels
   */
  public static drawCameraOverlay(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    cameraName: string,
    showScanlines: boolean
  ) {
    // Scanlines Retro CRT
    if (showScanlines) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1.5);
      }
    }

    // Khung 4 góc ngắm Camera an ninh (CCTV Viewfinder Corners)
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.5;
    const cornerSize = 16;
    const pad = 12;

    // Góc trên trái
    ctx.beginPath();
    ctx.moveTo(pad, pad + cornerSize);
    ctx.lineTo(pad, pad);
    ctx.lineTo(pad + cornerSize, pad);
    ctx.stroke();

    // Góc trên phải
    ctx.beginPath();
    ctx.moveTo(width - pad - cornerSize, pad);
    ctx.lineTo(width - pad, pad);
    ctx.lineTo(width - pad, pad + cornerSize);
    ctx.stroke();

    // Góc dưới trái
    ctx.beginPath();
    ctx.moveTo(pad, height - pad - cornerSize);
    ctx.lineTo(pad, height - pad);
    ctx.lineTo(pad + cornerSize, height - pad);
    ctx.stroke();

    // Góc dưới phải
    ctx.beginPath();
    ctx.moveTo(width - pad - cornerSize, height - pad);
    ctx.lineTo(width - pad, height - pad);
    ctx.lineTo(width - pad, height - pad - cornerSize);
    ctx.stroke();

    // Huy hiệu REC nhấp nháy đỏ
    const isBlink = Math.floor(Date.now() / 600) % 2 === 0;
    if (isBlink) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(pad + 12, pad + 12, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('REC', pad + 24, pad + 16);

    // Tên Camera an ninh hiện tại
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(pad + 65, pad + 3, cameraName.length * 7 + 16, 20);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1;
    ctx.strokeRect(pad + 65, pad + 3, cameraName.length * 7 + 16, 20);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText(`CAM: ${cameraName.toUpperCase()}`, pad + 72, pad + 17);
  }
}
